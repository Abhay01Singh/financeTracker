export default function BudgetCard({
  budget,
  spent = 0,
  onEdit,
  onDelete,
  isDashboard,
}) {
  const percent = Math.min((spent / budget.limit) * 100, 100);

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="text-lg font-bold">{budget.category}</h2>
      <p>Limit: {budget.limit}</p>
      <p>Spent: {spent}</p>
      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div
          className={`h-2 rounded ${
            percent >= 100 ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {!isDashboard && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline text-sm">
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:underline text-sm">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
