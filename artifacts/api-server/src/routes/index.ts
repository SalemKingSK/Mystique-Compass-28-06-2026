import { Router, type IRouter } from "express";
import healthRouter from "./health";
import biographyRouter from "./biography";

const router: IRouter = Router();

router.use(healthRouter);
router.use(biographyRouter);

export default router;
