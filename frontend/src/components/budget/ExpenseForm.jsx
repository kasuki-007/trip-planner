import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from '../../constants/expenseCategories';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.preprocess((v) => Number(v), z.number().positive('Amount must be positive')),
  category: z.string().min(1),
  paidBy: z.string().min(1),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});



export function ExpenseForm({ isOpen, onClose, onSave, members }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().substring(0, 10), category: 'food', paidBy: members[0]?.id ?? '' },
  });

  const categoryOptions = Object.values(EXPENSE_CATEGORIES).map((c) => ({ value: c, label: EXPENSE_CATEGORY_LABELS[c] ?? c }));
  const memberOptions = members.map((m) => ({ value: m.id, label: m.name }));

  const onSubmit = async (data) => {
    await onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Title" placeholder="e.g. Team dinner" error={errors.title?.message} {...register('title')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount (USD)" type="number" step="0.01" placeholder="0.00" error={errors.amount?.message} {...register('amount')} />
          <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        </div>
        <Select label="Category" options={categoryOptions} error={errors.category?.message} {...register('category')} />
        <Select label="Paid by" options={memberOptions} error={errors.paidBy?.message} {...register('paidBy')} />
        <Input label="Notes (optional)" placeholder="Any details..." {...register('notes')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Add Expense</Button>
        </div>
      </form>
    </Modal>
  );
}
