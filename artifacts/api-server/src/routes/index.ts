import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import uploadRouter from "./upload";
import projectRouter from "./projects";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(uploadRouter);
router.use(authRouter);
router.use(projectRouter);

export default router;
