import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import BudgetCard from "../components/BudgetCard";
import { GoalContribution } from "../components/GoalContribution";
export default function Dashboard() {
  const { axios } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, budgetRes, goalRes] = await Promise.all([
          axios.get("/api/transaction/read"),
          axios.get("/api/budget/read"),
          axios.get("/api/goal/read"),
        ]);

        if (txRes.data.success) setTransactions(txRes.data.transaction || []);
        if (budgetRes.data.success) setBudgets(budgetRes.data.budget || []);
        if (goalRes.data.success) setGoals(goalRes.data.goals || []);
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [axios]);

  // Update goal in state after contribution
  const handleUpdateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g))
    );
  };

  // Charts
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const incomeExpenseData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const categoryChart = Object.keys(categoryData).map((cat) => ({
    name: cat,
    value: categoryData[cat],
  }));

  const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9C27B0"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeExpenseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label>
                {incomeExpenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budgets */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Budgets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spent = transactions
              .filter((t) => t.type === "expense" && t.category === b.category)
              .reduce((acc, t) => acc + t.amount, 0);
            return (
              <BudgetCard
                key={b._id}
                budget={b}
                spent={spent}
                isDashboard={true}
              />
            );
          })}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Goals</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => {
            const percent = Math.min(
              (Number(g.savedAmount) / Number(g.targetAmount)) * 100,
              100
            );

            return (
              <div
                key={g._id}
                className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-lg font-bold">{g.name}</h2>
                <p>
                  Saved: ${Number(g.savedAmount)} / ${Number(g.targetAmount)}
                </p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="h-2 rounded bg-blue-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {percent >= 100 && (
                  <p className="text-green-600 mt-2 font-medium">
                    🎉 Goal Achieved!
                  </p>
                )}
                <GoalContribution goal={g} onUpdateGoal={handleUpdateGoal} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10">
        Made with ❤️ by Abhay
      </div>
    </div>
  );
}
