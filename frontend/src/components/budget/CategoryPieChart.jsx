import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '../../constants/expenseCategories';
import { formatCurrency } from '../../utils/calculateSplit';


export function CategoryPieChart({ expenses }) {
  const totals = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  });

  const data = Object.entries(totals).map(([cat, amount]) => ({
    name: EXPENSE_CATEGORY_LABELS[cat] ?? cat,
    value: amount,
    color: EXPENSE_CATEGORY_COLORS[cat] ?? '#6B7280',
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6B7280] text-sm">
        No expense data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={((val) => formatCurrency(Number(val)))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
