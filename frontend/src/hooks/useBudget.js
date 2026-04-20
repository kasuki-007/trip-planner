import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import toast from 'react-hot-toast';

export function useBudget(tripId) {
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => expenseService.getExpenses(tripId),
    enabled: !!tripId,
  });
}

export function useAddExpense(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expense) => expenseService.addExpense(tripId, expense),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateExpense(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, data }) =>
      expenseService.updateExpense(tripId, expenseId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteExpense(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId) => expenseService.deleteExpense(tripId, expenseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}
