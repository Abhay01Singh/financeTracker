import express from "express";
import authUser from "../middleware/authUser.js";
import { login, register } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

export default userRouter;
