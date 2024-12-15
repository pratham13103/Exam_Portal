import express  from "express";
import userRouter from "./user"
import ExamRouter from "./exam"
import TestRouter from "./create_test"

const router = express.Router();

router.use("/user", userRouter);
router.use("/exam", ExamRouter);
router.use("/create_test", TestRouter);

export default router
