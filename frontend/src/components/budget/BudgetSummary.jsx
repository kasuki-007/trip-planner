import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/calculateSplit';



export function BudgetSummary({ expenses, totalBudget, memberCount }) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const perPerson = memberCount > 0 ? totalSpent / memberCount : 0;
  const pct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const stats = [
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, color: '#E94560' },
    { label: 'Remaining', value: formatCurrency(remaining), icon: TrendingUp, color: remaining >= 0 ? '#10B981' : '#EF4444' },
    { label: 'Per Person', value: formatCurrency(perPerson), icon: Users, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-[#6B7280]">{label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {totalBudget > 0 && (
        <div>
          <div className="flex justify-between text-xs text-[#6B7280] mb-1">
            <span>Budget used</span>
            <span>{pct.toFixed(1)}% of {formatCurrency(totalBudget)}</span>
          </div>
          <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
