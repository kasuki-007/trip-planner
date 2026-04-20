import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { BudgetSummary } from '../components/budget/BudgetSummary';
import { CategoryPieChart } from '../components/budget/CategoryPieChart';
import { ExpensesByMember } from '../components/budget/ExpensesByMember';
import { ExpenseList } from '../components/budget/ExpenseList';
import { ExpenseForm } from '../components/budget/ExpenseForm';
import { useBudget, useAddExpense, useDeleteExpense } from '../hooks/useBudget';
import { useTripMembers, useTrip } from '../hooks/useTrip';
import { usePermissions } from '../hooks/usePermissions';
import toast from 'react-hot-toast';

export function BudgetPage() {
  const { id } = useParams();
  const { data: budgetData, isLoading: loadingBudget } = useBudget(id);
  const { data: trip } = useTrip(id);
  const { data: members = [] } = useTripMembers(trip);
  const { mutateAsync: addExpense } = useAddExpense(id);
  const { mutateAsync: deleteExpense } = useDeleteExpense(id);
  const { canAddExpense } = usePermissions();
  const [showForm, setShowForm] = useState(false);

  const expenses = budgetData?.expenses ?? [];
  const totalBudget = trip?.budget ?? 0;

  if (loadingBudget) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget Tracker"
        subtitle="Track shared expenses and split costs"
        action={canAddExpense ? { label: 'Add Expense', onClick: () => setShowForm(true) } : undefined}
      />

      <BudgetSummary expenses={expenses} totalBudget={totalBudget} memberCount={members.length} />

      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <h3 className="font-semibold text-[#1A1A2E] mb-4">By Category</h3>
            <CategoryPieChart expenses={expenses} />
          </div>
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <h3 className="font-semibold text-[#1A1A2E] mb-4">By Member</h3>
            <ExpensesByMember expenses={expenses} members={members} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
        <h3 className="font-semibold text-[#1A1A2E] mb-4">All Expenses</h3>
        <ExpenseList
          expenses={expenses}
          members={members}
          onDelete={async (expenseId) => {
            await deleteExpense(expenseId);
            toast.success('Expense removed');
          }}
        />
      </div>

      <ExpenseForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        members={members}
        onSave={async (data) => {
          await addExpense({ ...data, category: data.category });
          toast.success('Expense added');
        }}
      />
    </div>
  );
}
