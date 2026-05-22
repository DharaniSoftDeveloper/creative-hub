import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.resolve(process.cwd(), "uploads");
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (e) {
  // ignore
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const UPLOAD_TOKEN = process.env["UPLOAD_TOKEN"] || "demo-token-123";

const tokenAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers["x-upload-token"] || req.body?.uploadToken;
  req.uploadAuthorized = token === UPLOAD_TOKEN;
  next();
};

router.post("/upload", tokenAuth, upload.single("file"), (req, res) => {
  if (!req.uploadAuthorized) {
    res
      .status(401)
      .json({ error: "Unauthorized. Invalid or missing upload token." });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const publicPath = `/uploads/${path.basename(file.path)}`;

  req.log?.info({ filename: file.filename, size: file.size }, "File uploaded");
  res.json({ success: true, filename: file.filename, path: publicPath });
});

// List uploaded files
router.get("/uploads", (_req, res) => {
  try {
    const files = fs.readdirSync(path.resolve(process.cwd(), "uploads"));
    const items = files.map((f) => ({
      name: f,
      url: `/uploads/${encodeURIComponent(f)}`,
    }));
    res.json({ files: items });
  } catch (err) {
    res.status(500).json({ error: "Failed to list uploads" });
  }
});

export default router;
