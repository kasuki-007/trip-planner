import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '../services/tripService';
import toast from 'react-hot-toast';

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getTrips(),
  });
}

export function useTrip(id) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getTrip(id),
    enabled: !!id,
  });
}

// Derives populated user objects from trip.members — backend populates members.user automatically
export function useTripMembers(trip) {
  const users= (trip?.members ?? []).map((m) => ({
    id: m.user?._id ?? m.user?.id ?? m.userId,
    name: m.user?.name ?? '',
    email: m.user?.email ?? '',
    avatar: m.user?.avatar,
  }));
  return { data: users };
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripService.createTrip(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tripService.updateTrip(id, data),
    onSuccess: (_r, vars) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trip', vars.id] });
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => tripService.deleteTrip(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useInviteMember(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }) => tripService.inviteMember(tripId, email, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateMemberRole(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) => tripService.updateMemberRole(tripId, userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useRemoveMember(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => tripService.removeMember(tripId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useLeaveTrip(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => tripService.leaveTrip(tripId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
    onError: (err) => toast.error(err.message),
  });
}
