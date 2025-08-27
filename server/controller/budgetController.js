import Budget from "../models/Budget.js";

// create budget
export const createBudget = async (req, res) => {
  try {
    const { category, limit, period } = req.body;

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      period,
    });
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// read budget

export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.find({ user: req.user._id });
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update
export const updateBudget = async (req, res) => {
  try {
    const update = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!update) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }

    res.json({ success: true, budget: update });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }

    res.json({ success: true, message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
