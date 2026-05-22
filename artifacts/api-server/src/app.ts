import express, { type Express } from "express";
import path from "path";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files from the workspace `uploads/` directory
const uploadsDir = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Serve simple static assets from `public/` (e.g. upload demo)
const publicDir = path.resolve(process.cwd(), "public");
app.use("/upload-demo.html", express.static(publicDir));

// Serve Creative Hub built frontend
const creativeHubDist = path.resolve(process.cwd(), "..", "..", "artifacts", "creative-hub", "dist", "public");
app.use("/", express.static(creativeHubDist));

app.use("/api", router);

export default app;
