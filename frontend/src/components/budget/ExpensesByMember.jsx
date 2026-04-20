import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/calculateSplit';


export function ExpensesByMember({ expenses, members }) {
  const totals = {};
  expenses.forEach((e) => {
    totals[e.paidBy] = (totals[e.paidBy] ?? 0) + e.amount;
  });

  const data = members
    .map((m) => ({
      name: m.name.split(' ')[0],
      amount: totals[m.id] ?? 0,
    }))
    .filter((d) => d.amount > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6B7280] text-sm">
        No member expense data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={((val) => formatCurrency(Number(val)))} />
        <Bar dataKey="amount" fill="#E94560" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
