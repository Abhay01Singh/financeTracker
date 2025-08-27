import express from "express";

import authUser from "../middleware/authUser.js";
import {
  contributeToGoal,
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../controller/goalController.js";

const goalRouter = express.Router();

goalRouter.post("/create", authUser, createGoal);
goalRouter.get("/read", authUser, getGoals);
goalRouter.put("/update/:id", authUser, updateGoal);
goalRouter.delete("/delete/:id", authUser, deleteGoal);
goalRouter.delete("/contribute/:id", authUser, contributeToGoal);

export default goalRouter;
