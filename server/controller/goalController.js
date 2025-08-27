import Goal from "../models/Goal.js";

// Create
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      name,
      targetAmount,
      deadline,
    });

    res.json({ success: true, goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Read
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json({ success: true, goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update progress or details
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Goal.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });

    res.json({ success: true, goal: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Goal.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });

    res.json({ success: true, message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/goal/contribute/:id
export const contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    goal.savedAmount += Number(amount);
    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.json({ success: true, goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
