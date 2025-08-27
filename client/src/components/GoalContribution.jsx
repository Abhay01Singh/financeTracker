import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export function GoalContribution({ goal, onUpdateGoal }) {
  const { axios } = useAuth();
  const [amount, setAmount] = useState("");

  const handleContribute = async () => {
    const contribution = Number(amount);
    if (!contribution || contribution <= 0) {
      toast.error("Enter a valid contribution amount");
      return;
    }

    try {
      // 1️⃣ Create a transaction
      const { data: txData } = await axios.post("/api/transaction/create", {
        type: "income",
        amount: contribution,
        category: "Goal Contribution",
        goal: goal._id,
        note: `Contribution to ${goal.name}`,
      });

      if (!txData.success) {
        toast.error(txData.message || "Failed to create transaction");
        return;
      }

      // 2️⃣ Update the goal's savedAmount
      const updatedGoal = {
        ...goal,
        savedAmount: (goal.savedAmount || 0) + contribution,
      };

      const { data: goalData } = await axios.put(
        `/api/goal/update/${goal._id}`,
        { savedAmount: updatedGoal.savedAmount }
      );

      if (goalData.success && goalData.goal) {
        onUpdateGoal(goalData.goal); // update parent state
        toast.success(`Contributed $${contribution} to ${goal.name}`);
        setAmount(""); // reset input
      } else {
        toast.error(goalData.message || "Failed to update goal");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Contribution failed");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="border p-1 rounded w-20"
      />
      <button
        onClick={handleContribute}
        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm">
        Add
      </button>
    </div>
  );
}
