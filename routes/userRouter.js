import { Router } from "express";
import { getUserStats } from "../controller/userController.js";
import passport from "passport";

const userRouter = Router();

userRouter.get('/stats', passport.authenticate('jwt', {session: false}), getUserStats);

export default userRouter;