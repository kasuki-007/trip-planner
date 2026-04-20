import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../services/fileService';
import { reservationService } from '../services/reservationService';
import toast from 'react-hot-toast';

export function useFiles(tripId) {
  return useQuery({
    queryKey: ['files', tripId],
    queryFn: () => fileService.getFiles(tripId),
    enabled: !!tripId,
  });
}

export function useUploadFile(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => fileService.uploadFile(tripId, formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteFile(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId) => fileService.deleteFile(tripId, fileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useReservations(tripId) {
  return useQuery({
    queryKey: ['reservations', tripId],
    queryFn: () => reservationService.getReservations(tripId),
    enabled: !!tripId,
  });
}

export function useAddReservation(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      reservationService.addReservation(tripId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteReservation(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (resId) => reservationService.deleteReservation(tripId, resId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}
