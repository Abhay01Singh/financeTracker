// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String }, // ✅ make optional
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
