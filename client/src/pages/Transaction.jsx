import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
  const { axios } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/transaction/read");
      if (data.success) setTransactions(data.transaction);
    } catch {
      toast.error("Failed to fetch transactions");
    }
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get("/api/budget/read");
      if (data.success) setBudgets(data.budget);
    } catch {
      toast.error("Failed to fetch budgets");
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const { data } = await axios.get("/api/goal/read");
      if (data.success) setGoals(data.goals);
    } catch {
      toast.error("Failed to fetch goals");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchGoals();
  }, []);

  // Reset form
  const resetForm = () => {
    setType("expense");
    setCategory("");
    setGoal("");
    setAmount("");
    setNote("");
    setEditId(null);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (type === "expense" && !category) {
      toast.error("Category is required for expenses");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    // Build payload
    const payload = {
      type,
      amount: Number(amount),
      note,
    };

    if (type === "expense") payload.category = category;
    if (type === "income" && goal) payload.goal = goal;

    try {
      if (editId) {
        const { data } = await axios.put(
          `/api/transaction/update/${editId}`,
          payload
        );
        if (data.success) toast.success("Transaction updated!");
      } else {
        const { data } = await axios.post("/api/transaction/create", payload);
        if (data.success) toast.success("Transaction added!");
      }

      fetchTransactions();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/transaction/delete/${id}`);
      if (data.success) {
        toast.success("Transaction deleted!");
        fetchTransactions();
      }
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  // Handle edit
  const handleEdit = (t) => {
    setEditId(t._id);
    setType(t.type);
    setAmount(t.amount);
    setNote(t.note);
    if (t.type === "expense") setCategory(t.category);
    if (t.type === "income") setGoal(t.goal?._id || "");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {/* Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-5 gap-3 p-4 bg-white rounded-lg shadow">
        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Category (expenses only) */}
        {type === "expense" && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
            required={type === "expense"}>
            <option value="">Select Category</option>
            {budgets.map((b) => (
              <option key={b._id} value={b.category}>
                {b.category}
              </option>
            ))}
          </select>
        )}

        {/* Goal (income only) */}
        {type === "income" && (
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border p-2 rounded">
            <option value="">No Goal</option>
            {goals.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} (saved: {g.savedAmount}/{g.targetAmount})
              </option>
            ))}
          </select>
        )}

        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
          placeholder="Amount"
          required
        />

        {/* Note */}
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 rounded"
          placeholder="Note"
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
