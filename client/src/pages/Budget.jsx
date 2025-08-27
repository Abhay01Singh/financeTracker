import { useEffect, useState } from "react";
import BudgetCard from "../components/BudgetCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [editId, setEditId] = useState(null);
  const { axios } = useAuth();

  // Fetch budgets
  const fetchBudget = async () => {
    try {
      const { data } = await axios.get("/api/budget/read");
      if (data.success) setBudgets(data.budget);
    } catch {
      toast.error("Failed to fetch budgets");
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/transaction/read");
      if (data.success) setTransactions(data.transaction);
    } catch {
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchBudget();
    fetchTransactions();
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await axios.put(`/api/budget/update/${editId}`, {
          category,
          limit: Number(limit),
          period,
        });
        if (data.success) {
          toast.success("Budget updated");
          setEditId(null);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post("/api/budget/create", {
          category,
          limit: Number(limit),
          period,
        });
        if (data.success) {
          toast.success("Budget added");
        } else {
          toast.error(data.message);
        }
      }
      fetchBudget();
      resetBudget();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Reset form
  const resetBudget = () => {
    setCategory("");
    setLimit("");
    setPeriod("monthly");
    setEditId(null);
  };

  // Edit budget
  const handleEdit = (b) => {
    setEditId(b._id);
    setCategory(b.category);
    setLimit(b.limit);
    setPeriod(b.period);
  };

  // Delete budget
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/budget/delete/${id}`);
      if (data.success) {
        fetchBudget();
        toast.success("Budget deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Budgets</h1>

      {/* Budget Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-4 gap-3 p-4 bg-white rounded-lg shadow">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
          required>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Limit"
          className="border p-2 rounded"
          required
        />

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border p-2 rounded">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Budgets List */}
      <div className="grid md:grid-cols-3 gap-4">
        {budgets.length > 0 ? (
          budgets.map((b) => {
            const spent = transactions
              .filter((t) => t.type === "expense" && t.category === b.category)
              .reduce((acc, t) => acc + t.amount, 0);

            return (
              <BudgetCard
                key={b._id}
                budget={b}
                spent={spent}
                onEdit={() => handleEdit(b)}
                onDelete={() => handleDelete(b._id)}
                isDashboard={false}
              />
            );
          })
        ) : (
          <p className="text-gray-500">No budgets found.</p>
        )}
      </div>
    </div>
  );
}
