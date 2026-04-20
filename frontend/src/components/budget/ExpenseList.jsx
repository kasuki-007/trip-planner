import { Trash2 } from 'lucide-react';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '../../constants/expenseCategories';
import { formatCurrency } from '../../utils/calculateSplit';
import { formatDateShort } from '../../utils/formatDate';
import { PermissionGate } from '../trip/PermissionGate';

export function ExpenseList({ expenses, members, onDelete }) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m.name]));

  if (expenses.length === 0) {
    return <p className="text-center text-[#6B7280] py-8 text-sm">No expenses recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E0E0E0] text-[#6B7280] text-left">
            <th className="pb-2 font-medium">Title</th>
            <th className="pb-2 font-medium">Category</th>
            <th className="pb-2 font-medium">Paid by</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium text-right">Amount</th>
            <th className="pb-2 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E0E0]">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-[#F8F9FA] transition-colors group">
              <td className="py-3 font-medium text-[#1A1A2E]">{expense.title}</td>
              <td className="py-3">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: EXPENSE_CATEGORY_COLORS[expense.category] ?? '#6B7280' }}
                >
                  {EXPENSE_CATEGORY_LABELS[expense.category]}
                </span>
              </td>
              <td className="py-3 text-[#6B7280]">{memberMap[expense.paidBy] ?? expense.paidBy}</td>
              <td className="py-3 text-[#6B7280]">{formatDateShort(expense.date)}</td>
              <td className="py-3 text-right font-semibold text-[#1A1A2E]">{formatCurrency(expense.amount)}</td>
              <td className="py-3 text-right">
                <PermissionGate require="canAddExpense">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </PermissionGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
