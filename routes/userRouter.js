import { Router } from "express";
import { getUserStats } from "../controller/userController.js";
import passport from "passport";
import { authenticateJWT } from "../middleware/auth.js";

const userRouter = Router();

userRouter.get('/stats', authenticateJWT, getUserStats);

export default userRouter;

