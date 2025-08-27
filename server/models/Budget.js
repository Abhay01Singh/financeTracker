import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  limit: Number,
  period: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  spent: { type: Number, default: 0 }, // ✅ track actual spent
});

export default mongoose.model("Budget", BudgetSchema);
