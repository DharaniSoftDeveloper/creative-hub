import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Router } from "express";

const router = Router();
const dataDir = path.resolve(process.cwd(), "submissions");
const authFile = path.join(dataDir, "admin-auth.json");

try {
  fs.mkdirSync(dataDir, { recursive: true });
} catch {
  // ignore
}

const sessions = new Map<string, { username: string; createdAt: string }>();

function getDefaultAdminConfig() {
  return {
    username: "creativehub-admin",
    passwordHash: crypto.createHash("sha256").update("Priya2k@05").digest("hex"),
  };
}

function loadAdminConfig() {
  try {
    const raw = fs.readFileSync(authFile, "utf8");
    const parsed = JSON.parse(raw) as { username?: string; passwordHash?: string };
    if (parsed.username && parsed.passwordHash) {
      return parsed;
    }
  } catch {
    // ignore
  }

  const config = getDefaultAdminConfig();
  fs.writeFileSync(authFile, JSON.stringify(config, null, 2));
  return config;
}

const adminConfig = loadAdminConfig();

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

function getTokenFromRequest(req: { headers: Record<string, string | string[] | undefined> }) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const headerToken = req.headers["x-admin-token"];
  if (typeof headerToken === "string") {
    return headerToken;
  }

  if (Array.isArray(headerToken)) {
    return headerToken[0];
  }

  return undefined;
}

export function requireAdminAuth(req: any, res: any, next: () => void) {
  const token = getTokenFromRequest(req);
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }

  req.adminSession = sessions.get(token);
  next();
}

router.post("/auth/login", (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  if (username !== adminConfig.username) {
    res.status(401).json({ error: "Invalid admin credentials." });
    return;
  }

  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  if (passwordHash !== adminConfig.passwordHash) {
    res.status(401).json({ error: "Invalid admin credentials." });
    return;
  }

  const token = createToken();
  sessions.set(token, {
    username,
    createdAt: new Date().toISOString(),
  });

  res.json({ authenticated: true, token });
});

router.post("/auth/logout", (req, res) => {
  const token = getTokenFromRequest(req);
  if (token) {
    sessions.delete(token);
  }

  res.json({ authenticated: false });
});

router.get("/auth/me", (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const session = sessions.get(token);
  res.json({ authenticated: true });
});

export default router;
