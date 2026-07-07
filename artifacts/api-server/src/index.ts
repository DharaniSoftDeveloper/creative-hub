import fs from "node:fs";
import path from "node:path";
import app from "./app";
import https from "node:https";
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

async function trySeedFromRepoOrGithub() {
  const repoSeed = path.resolve(process.cwd(), "artifacts", "api-server", "submissions", "projects.json");
  const runtimeDir = path.resolve(process.cwd(), "submissions");
  const runtimeFile = path.join(runtimeDir, "projects.json");

  try {
    if (fs.existsSync(runtimeFile) && process.env.FORCE_SEED !== "true") {
      logger.info({ dest: runtimeFile }, "Runtime projects.json already exists; skipping seed");
      return;
    }

    if (fs.existsSync(repoSeed)) {
      fs.mkdirSync(runtimeDir, { recursive: true });
      fs.copyFileSync(repoSeed, runtimeFile);
      logger.info({ src: repoSeed, dest: runtimeFile }, "Seeded projects.json into runtime submissions directory");
      return;
    }

    // Attempt to fetch from GitHub raw if repo seed is not present in the runtime image
    const rawUrl = `https://raw.githubusercontent.com/DharaniSoftDeveloper/creative-hub/main/artifacts/api-server/submissions/projects.json`;
    logger.info({ url: rawUrl }, "Attempting to download projects.json from GitHub raw URL");

    await new Promise<void>((resolve, reject) => {
      https
        .get(rawUrl, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download seed: status ${res.statusCode}`));
            return;
          }

          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(Buffer.from(c)));
          res.on("end", () => {
            try {
              const text = Buffer.concat(chunks).toString("utf8");
              const parsed = JSON.parse(text);
              fs.mkdirSync(runtimeDir, { recursive: true });
              fs.writeFileSync(runtimeFile, JSON.stringify(parsed, null, 2), "utf8");
              logger.info({ url: rawUrl, dest: runtimeFile }, "Downloaded and wrote seed projects.json from GitHub");
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        })
        .on("error", (err) => reject(err));
    });
  } catch (err) {
    logger.warn({ err }, "Seed attempt failed (non-fatal)");
  }
}

async function main() {
  await trySeedFromRepoOrGithub();

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

void main();
