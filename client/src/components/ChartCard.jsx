import {
  PieChart,
  Pie,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

export default function ChartCard({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expense },
  ];

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-bold mb-4">Overview</h2>
      <PieChart width={300} height={300}>
        <Pie dataKey="value" data={pieData} fill="#8884d8" label />
        <Tooltip />
      </PieChart>
    </div>
  );
}
