import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { GoalContribution } from "../components/GoalContribution";

export default function Goals() {
  const { axios } = useAuth();
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const { data } = await axios.get("/api/goal/read");
      if (data.success && Array.isArray(data.goals)) {
        setGoals(data.goals);
      }
    } catch {
      toast.error("Failed to load goals");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add / Update goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      toast.error("Name and target amount are required");
      return;
    }

    try {
      if (editId) {
        const { data } = await axios.put(`/api/goal/update/${editId}`, {
          name,
          targetAmount: Number(targetAmount),
          deadline,
        });
        if (data.success && data.goal) {
          toast.success("Goal Updated");
          setGoals((prev) =>
            prev.map((g) => (g._id === editId ? data.goal : g))
          );
          setEditId(null);
        }
      } else {
        const { data } = await axios.post("/api/goal/create", {
          name,
          targetAmount: Number(targetAmount),
          deadline,
        });
        if (data.success && data.goal) {
          toast.success("Goal created!");
          setGoals((prev) => [...prev, data.goal]);
        }
      }

      setName("");
      setTargetAmount("");
      setDeadline("");
    } catch {
      toast.error("Error creating/updating goal");
    }
  };

  // Delete goal
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/goal/delete/${id}`);
      if (data.success) {
        toast.success("Goal deleted");
        setGoals((prev) => prev.filter((g) => g._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Edit goal
  const handleEdit = (g) => {
    if (!g || !g._id) return;
    setEditId(g._id);
    setName(g.name || "");
    setTargetAmount(g.targetAmount || "");
    setDeadline(g.deadline?.split("T")[0] || "");
  };

  // Update goal state after contribution
  const handleUpdateGoal = (updatedGoal) => {
    if (!updatedGoal || !updatedGoal._id) return;
    setGoals((prev) =>
      prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Goals</h1>

      {/* Add/Edit Goal Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-3 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Goal Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="Target Amount"
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {editId ? "Update Goal" : "Add Goal"}
        </button>
      </form>

      {/* Goals Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Target</th>
              <th className="p-2">Saved</th>
              <th className="p-2">Status</th>
              <th className="p-2">Contribute</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals
              .filter(Boolean) // remove undefined/null
              .map((g) => (
                <tr key={g._id}>
                  <td className="p-2">{g.name}</td>
                  <td className="p-2">${g.targetAmount}</td>
                  <td className="p-2">${Number(g.savedAmount || 0)}</td>
                  <td className="p-2">{g.status || "-"}</td>
                  <td className="p-2">
                    <GoalContribution
                      goal={g}
                      onUpdateGoal={handleUpdateGoal}
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
