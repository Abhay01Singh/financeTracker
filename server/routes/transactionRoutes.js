import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "../controller/transactionController.js";
import authUser from "../middleware/authUser.js";

const transactionRouter = express.Router();

transactionRouter.post("/create", authUser, createTransaction);
transactionRouter.get("/read", authUser, getTransaction);
transactionRouter.put("/update/:id", authUser, updateTransaction);
transactionRouter.delete("/delete/:id", authUser, deleteTransaction);

export default transactionRouter;
