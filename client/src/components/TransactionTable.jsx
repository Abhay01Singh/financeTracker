export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2">Type</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Note</th>
            <th className="p-2">Goal</th> {/* ✅ new */}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-b">
              <td className="p-2">{t.type}</td>
              <td className="p-2">
                {t.goal ? "Goal Contribution" : t.category}
              </td>
              <td className="p-2">${t.amount}</td>
              <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="p-2">{t.note}</td>
              <td className="p-2">
                {t.goal ? (
                  <span className="text-green-600 font-medium">
                    {t.goal.name} ({t.goal.savedAmount}/{t.goal.targetAmount})
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t._id)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
