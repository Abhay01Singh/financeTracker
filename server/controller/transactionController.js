import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import Goal from "../models/Goal.js";

// create
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, goal } = req.body;

    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });

    // --- Update Budget if expense ---
    if (type === "expense" && category) {
      const budget = await Budget.findOne({ user: req.user._id, category });
      if (budget) {
        budget.spent += amount;
        await budget.save();
      }
    }

    // --- Update Goal if income + goal linked ---
    if (type === "income" && goal) {
      const g = await Goal.findOne({ _id: goal, user: req.user._id });
      if (g) {
        g.savedAmount += amount;
        if (g.savedAmount >= g.targetAmount) g.status = "completed";
        await g.save();
      }
    }

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ : /api/transaction/read
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find({ user: req.user._id })
      .populate("goal", "name targetAmount savedAmount status")
      .sort({ date: -1 });

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateTransaction = async (req, res) => {
  try {
    const oldTx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!oldTx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    // Rollback old goal effect
    if (oldTx.type === "income" && oldTx.goal) {
      const g = await Goal.findOne({ _id: oldTx.goal, user: req.user._id });
      if (g) {
        g.savedAmount -= oldTx.amount;
        if (g.savedAmount < g.targetAmount) g.status = "ongoing";
        await g.save();
      }
    }

    // Apply new transaction
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Apply new goal effect
    if (transaction.type === "income" && transaction.goal) {
      const g = await Goal.findOne({
        _id: transaction.goal,
        user: req.user._id,
      });
      if (g) {
        g.savedAmount += transaction.amount;
        if (g.savedAmount >= g.targetAmount) g.status = "completed";
        await g.save();
      }
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    if (transaction.type === "income" && transaction.goal) {
      const g = await Goal.findOne({
        _id: transaction.goal,
        user: req.user._id,
      });
      if (g) {
        g.savedAmount -= transaction.amount;
        if (g.savedAmount < g.targetAmount) g.status = "ongoing";
        await g.save();
      }
    }

    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
