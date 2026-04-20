import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryService } from '../services/itineraryService';
import toast from 'react-hot-toast';

export function useItinerary(tripId) {
  return useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => itineraryService.getItinerary(tripId),
    enabled: !!tripId,
  });
}

export function useAddDay(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date) => itineraryService.addDay(tripId, date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateDay(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, data }) =>
      itineraryService.updateDay(tripId, dayId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteDay(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dayId) => itineraryService.deleteDay(tripId, dayId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useAddActivity(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, activity }) =>
      itineraryService.addActivity(tripId, dayId, activity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateActivity(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, data }) =>
      itineraryService.updateActivity(tripId, activityId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteActivity(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (activityId) => itineraryService.deleteActivity(tripId, activityId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useReorderActivities(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, orderedIds }) =>
      itineraryService.reorderActivities(tripId, dayId, orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itinerary', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}
