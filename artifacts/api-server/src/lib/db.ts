import path from 'node:path';
import fs from 'node:fs';

let Database: any;
try {
  // better-sqlite3 is optional; require at runtime so deployments without native build won't fail during install
  // If not available, callers should fallback to file JSON writes.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Database = require('better-sqlite3');
} catch (e) {
  Database = null;
}

const persistentDir = process.env.PERSISTENT_DATA_DIR ? path.resolve(process.env.PERSISTENT_DATA_DIR) : null;
const dbDir = persistentDir || path.resolve(process.cwd(), 'data');
const dbFile = process.env['DATABASE_PATH'] || path.join(dbDir, 'projects.db');

if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch {
    // ignore
  }
}

let db: any = null;

export function hasSqlite() {
  return !!Database;
}

export function initDb() {
  if (!Database) return null;
  if (db) return db;

  db = new Database(dbFile);

  // create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      projectName TEXT,
      clientName TEXT,
      clientEmail TEXT,
      description TEXT,
      status TEXT,
      notes TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      meta JSON
    )
  `);

  return db;
}

function serializeMeta(obj: any) {
  try { return JSON.stringify(obj); } catch { return '{}'; }
}

export function allProjects(): any[] {
  if (!Database) return [];
  initDb();
  const stmt = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC');
  const rows = stmt.all();
  return rows.map((r: any) => ({ ...r, meta: r.meta ? JSON.parse(r.meta) : {} }));
}

export function getProject(id: string) {
  if (!Database) return null;
  initDb();
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  return { ...row, meta: row.meta ? JSON.parse(row.meta) : {} };
}

export function insertProject(project: any) {
  if (!Database) return null;
  initDb();
  const meta = {
    progressPercentage: project.progressPercentage || 0,
    estimatedDeliveryDays: project.estimatedDeliveryDays || null,
    timeline: project.timeline || [],
    modules: project.modules || [],
    dailyLogs: project.dailyLogs || [],
    uploads: project.uploads || [],
  };

  const stmt = db.prepare(`INSERT INTO projects (id, projectName, clientName, clientEmail, description, status, notes, createdAt, updatedAt, meta) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  stmt.run(project.id, project.projectName, project.clientName, project.clientEmail, project.description, project.status, project.notes, project.createdAt, project.updatedAt, serializeMeta(meta));
  return getProject(project.id);
}

export function updateProject(id: string, updates: any) {
  if (!Database) return null;
  initDb();
  const existing = getProject(id);
  if (!existing) return null;
  const meta = { ...(existing.meta || {}), ...(updates.meta || {}) };

  const merged = {
    projectName: updates.projectName ?? existing.projectName,
    clientName: updates.clientName ?? existing.clientName,
    clientEmail: updates.clientEmail ?? existing.clientEmail,
    description: updates.description ?? existing.description,
    status: updates.status ?? existing.status,
    notes: updates.notes ?? existing.notes,
    createdAt: existing.createdAt,
    updatedAt: updates.updatedAt || new Date().toISOString(),
  };

  const stmt = db.prepare(`UPDATE projects SET projectName=?, clientName=?, clientEmail=?, description=?, status=?, notes=?, updatedAt=?, meta=? WHERE id=?`);
  stmt.run(merged.projectName, merged.clientName, merged.clientEmail, merged.description, merged.status, merged.notes, merged.updatedAt, serializeMeta(meta), id);
  return getProject(id);
}
