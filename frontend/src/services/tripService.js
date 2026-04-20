import api from './api';

function normalizeTrip(t) {
  return {
    ...t,
    id: t._id ?? t.id,
    members: (t.members ?? []).map((m) => ({
      userId: m.user?._id ?? m.user?.id ?? m.userId,
      role: m.role,
      user: m.user,
    })),
  };
}

export const tripService = {
  async getTrips() {
    const res = await api.get('/trips');
    return (res.data ?? []).map(normalizeTrip);
  },

  async getTrip(tripId )  {
    const res = await api.get(`/trips/${tripId}`) ;
    return normalizeTrip(res.data);
  },

  async createTrip(data) {
    const res = await api.post('/trips', data) ;
    return normalizeTrip(res.data);
  },

  async updateTrip(tripId, data) {
    const res = await api.patch(`/trips/${tripId}`, data) ;
    return normalizeTrip(res.data);
  },

  async deleteTrip(tripId) {
    await api.delete(`/trips/${tripId}`);
  },

  async inviteMember(tripId, email, role) {
    const res = await api.post(`/trips/${tripId}/invite`, { email, role }) ;
    return normalizeTrip(res.data);
  },

  async updateMemberRole(tripId, userId, role) {
    const res = await api.patch(`/trips/${tripId}/members/${userId}`, { role }) ;
    return normalizeTrip(res.data);
  },

  async removeMember(tripId, userId) {
    const res = await api.delete(`/trips/${tripId}/members/${userId}`) ;
    return normalizeTrip(res.data);
  },

  async leaveTrip(tripId) {
    await api.post(`/trips/${tripId}/leave`);
  },
};
