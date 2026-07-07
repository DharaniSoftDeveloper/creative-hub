import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { requireAdminAuth } from "./auth";

const router = Router();

const dataDir = path.resolve(process.cwd(), "submissions");
const dataFile = path.join(dataDir, "projects.json");
const uploadDir = path.resolve(process.cwd(), "uploads");

try {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });
} catch {
  // ignore
}

type ProjectStatus = "Draft" | "Confirmed" | "In Progress" | "Review" | "Delivered" | "Completed";

type ProjectRecord = {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  description: string;
  status: ProjectStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  fileName?: string;
  fileUrl?: string;
  // Rich metadata
  progressPercentage?: number; // 0-100
  estimatedDeliveryDays?: number; // days remaining
  timeline?: Array<{ step: string; done: boolean }>;
  modules?: Array<{ name: string; progress: number }>;
  dailyLogs?: Array<{ date: string; entries: string[] }>;
  uploads?: Array<{ fileName: string; fileUrl: string; type?: string }>; // screenshots, videos, apk
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

function readProjects(): ProjectRecord[] {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw) as { projects?: ProjectRecord[] };
    return Array.isArray(parsed.projects) ? parsed.projects : [];
  } catch {
    // If runtime data file is missing or unreadable (common on freshly deployed environments),
    // attempt to load a seed file that may be present in the repository.
    try {
      const repoSeed = path.resolve(process.cwd(), "artifacts", "api-server", "submissions", "projects.json");
      if (fs.existsSync(repoSeed)) {
        const raw = fs.readFileSync(repoSeed, "utf8");
        const parsed = JSON.parse(raw) as { projects?: ProjectRecord[] };
        return Array.isArray(parsed.projects) ? parsed.projects : [];
      }
    } catch {
      // ignore
    }
    return [];
  }
}

function writeProjects(projects: ProjectRecord[]) {
  fs.writeFileSync(dataFile, JSON.stringify({ projects }, null, 2));
}

function generateProjectId() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CH-${stamp}-${suffix}`;
}

async function sendProjectIdEmail(project: ProjectRecord) {
  const smtpHost = process.env["SMTP_HOST"];
  const smtpPort = Number(process.env["SMTP_PORT"] || 587);
  const smtpUser = process.env["SMTP_USER"];
  const smtpPass = process.env["SMTP_PASS"];
  const recipient = project.clientEmail;

  if (!smtpHost || !smtpUser || !smtpPass || !recipient) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: smtpUser,
    to: recipient,
    subject: `Your Creative Hub project ID: ${project.id}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="color:#a16207;">Creative Hub Project Update</h2>
        <p>Hi ${project.clientName},</p>
        <p>Your project <strong>${project.projectName}</strong> is now registered in our portal.</p>
        <p><strong>Project ID:</strong> ${project.id}</p>
        <p>Please use this ID to check your project status and view project updates in the client portal.</p>
      </div>
    `,
  });
}

router.get("/projects", requireAdminAuth, (_req, res) => {
  res.json({ projects: readProjects() });
});

router.post("/projects", requireAdminAuth, async (req, res) => {
  const { projectName, clientName, clientEmail, description, status, notes } = req.body ?? {};

  if (!projectName || !clientName || !clientEmail || !description) {
    res.status(400).json({ error: "Project name, client name, email, and description are required." });
    return;
  }

  const project: ProjectRecord = {
    id: generateProjectId(),
    projectName: String(projectName),
    clientName: String(clientName),
    clientEmail: String(clientEmail),
    description: String(description),
    status: (status as ProjectStatus) || "Confirmed",
    notes: String(notes || ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const projects = readProjects();
  projects.unshift(project);
  writeProjects(projects);

  try {
    await sendProjectIdEmail(project);
  } catch (error) {
    req.log?.warn({ err: error, projectId: project.id }, "Failed to send project ID email");
  }

  res.status(201).json({ project });
});

router.get("/projects/:projectId", (req, res) => {
  const project = readProjects().find((entry) => entry.id === req.params.projectId);

  if (!project) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  res.json({ project });
});

router.patch("/projects/:projectId", requireAdminAuth, (req, res) => {
  const projects = readProjects();
  const index = projects.findIndex((entry) => entry.id === req.params.projectId);

  if (index === -1) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  const nextProject = {
    ...projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  } as ProjectRecord;

  projects[index] = nextProject;
  writeProjects(projects);

  res.json({ project: nextProject });
});

router.post("/projects/:projectId/upload", requireAdminAuth, upload.single("file"), (req, res) => {
  const projects = readProjects();
  const index = projects.findIndex((entry) => entry.id === req.params.projectId);

  if (index === -1) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  const publicPath = `/uploads/${path.basename(req.file.path)}`;
  const existing = projects[index];
  const uploadEntry = { fileName: req.file.originalname, fileUrl: publicPath, type: req.body.type || undefined };

  const updatedProject: ProjectRecord = {
    ...existing,
    uploads: Array.isArray(existing.uploads) ? [uploadEntry, ...existing.uploads] : [uploadEntry],
    // keep legacy single-file fields for compatibility
    fileName: req.file.originalname,
    fileUrl: publicPath,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  writeProjects(projects);

  res.json({ project: updatedProject });
});

// Admin helper: import seed projects from repository into runtime submissions
router.post("/projects/import-seed", requireAdminAuth, (req, res) => {
  try {
    const repoSeed = path.resolve(process.cwd(), "artifacts", "api-server", "submissions", "projects.json");
    if (!fs.existsSync(repoSeed)) {
      res.status(404).json({ error: "Seed file not found in repo." });
      return;
    }

    const raw = fs.readFileSync(repoSeed, "utf8");
    const parsed = JSON.parse(raw) as { projects?: ProjectRecord[] };
    const projects = Array.isArray(parsed.projects) ? parsed.projects : [];
    writeProjects(projects);

    res.json({ imported: projects.length });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
