import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistService } from '../services/checklistService';
import toast from 'react-hot-toast';

export function useChecklists(tripId) {
  return useQuery({
    queryKey: ['checklists', tripId],
    queryFn: () => checklistService.getChecklists(tripId),
    enabled: !!tripId,
  });
}

export function useAddChecklistItem(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ listType, label }) =>
      checklistService.addItem(tripId, listType, label),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useToggleChecklistItem(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ listType, itemId, completed }) =>
      checklistService.updateItem(tripId, listType, itemId, { completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteChecklistItem(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ listType, itemId }) =>
      checklistService.deleteItem(tripId, listType, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}
