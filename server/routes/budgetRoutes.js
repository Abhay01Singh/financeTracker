import express from "express";
import authUser from "../middleware/authUser.js";
import {
  createBudget,
  deleteBudget,
  getBudget,
  updateBudget,
} from "../controller/budgetController.js";

const budgetRouter = express.Router();

budgetRouter.post("/create", authUser, createBudget);
budgetRouter.get("/read", authUser, getBudget);
budgetRouter.put("/update/:id", authUser, updateBudget);
budgetRouter.delete("/delete/:id", authUser, deleteBudget);

export default budgetRouter;
