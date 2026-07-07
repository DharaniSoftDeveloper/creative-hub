import fs from "node:fs";
import path from "node:path";
import app from "./app";
import { logger } from "./lib/logger";

const localEnvPath = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(localEnvPath)) {
  process.loadEnvFile(localEnvPath);
}

const rawPort = process.env["PORT"] || "10000";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// Seed submissions/projects.json into runtime submissions folder if present in the repository.
try {
  const repoSeed = path.resolve(process.cwd(), "artifacts", "api-server", "submissions", "projects.json");
  const runtimeDir = path.resolve(process.cwd(), "submissions");
  const runtimeFile = path.join(runtimeDir, "projects.json");

  if (fs.existsSync(repoSeed)) {
    try {
      fs.mkdirSync(runtimeDir, { recursive: true });
      if (!fs.existsSync(runtimeFile) || process.env.FORCE_SEED === "true") {
        fs.copyFileSync(repoSeed, runtimeFile);
        logger.info({ src: repoSeed, dest: runtimeFile }, "Seeded projects.json into runtime submissions directory");
      } else {
        logger.info({ dest: runtimeFile }, "Runtime projects.json already exists; skipping seed");
      }
    } catch (err) {
      logger.warn({ err }, "Failed to seed projects.json into runtime submissions dir");
    }
  } else {
    logger.info({ src: repoSeed }, "No seed projects.json found in repository");
  }
} catch (err) {
  // non-fatal
}
