import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(uploadRouter);

export default router;
