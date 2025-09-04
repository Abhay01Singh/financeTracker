export function generateInsights({
  transactions = [],
  budgets = [],
  goals = [],
}) {
  const insights = [];

  // ---- 1. Income vs Expenses ----
  const income = transactions
    .filter((t) => t.type === "income") // ✅ exclude goalContribution
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (expenses > income) {
    insights.push("💸 Your expenses are higher than your income this month.");
  } else {
    insights.push("✅ Your income covers your expenses this month.");
  }

  // ---- 2. Budget Warnings ----
  budgets.forEach((b) => {
    const spent = transactions
      .filter((t) => t.category === b.category && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    if (spent > b.amount) {
      insights.push(
        `⚠️ You've exceeded your ${b.category} budget by $${spent - b.amount}.`
      );
    } else if (spent > b.amount * 0.8) {
      insights.push(
        `⚠️ You're at ${Math.round((spent / b.amount) * 100)}% of your ${
          b.category
        } budget.`
      );
    }
  });

  // ---- 3. Goal Progress ----
  goals.forEach((g) => {
    if (g.status !== "completed") {
      const progress = (g.savedAmount / g.targetAmount) * 100;

      if (progress >= 75 && progress < 100) {
        insights.push(
          `🎯 Your goal "${g.name}" is ${Math.round(
            progress
          )}% complete. Almost there!`
        );
      } else if (progress < 25) {
        insights.push(
          `📉 Your goal "${g.name}" is just ${Math.round(
            progress
          )}% complete. Try contributing more.`
        );
      }
    }
  });

  // ---- 4. Recurring Expenses ----
  const merchantCounts = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      merchantCounts[t.merchant] = (merchantCounts[t.merchant] || 0) + 1;
    });

  Object.entries(merchantCounts).forEach(([merchant, count]) => {
    if (count >= 3) {
      insights.push(
        `🔁 You have recurring expenses at ${merchant}. Consider reviewing subscriptions.`
      );
    }
  });

  return insights;
}
