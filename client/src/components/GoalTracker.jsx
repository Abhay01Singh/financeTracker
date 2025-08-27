export default function GoalTracker({ goal }) {
  const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="text-lg font-bold">{goal.title}</h2>
      <p>
        Saved: {Number(goal.savedAmount)} / {goal.targetAmount}
      </p>
      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div
          className="h-2 rounded bg-blue-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent >= 100 && (
        <p className="text-green-600 mt-2 font-medium">🎉 Goal Achieved!</p>
      )}
    </div>
  );
}
