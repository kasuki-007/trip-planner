import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import toast from 'react-hot-toast';

export function useComments(tripId, refType, refId) {
  return useQuery({
    queryKey: ['comments', tripId, refType, refId],
    queryFn: () => commentService.getComments(tripId, refType, refId),
    enabled: !!tripId && !!refType && !!refId,
  });
}

export function useAddComment(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      commentService.addComment(tripId, data),
    onSuccess: (_r, vars) => qc.invalidateQueries({ queryKey: ['comments', tripId, vars.refType, vars.refId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateComment(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }) =>
      commentService.updateComment(tripId, commentId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteComment(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => commentService.deleteComment(tripId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}
