import api from './api';

function normalizeReservation(r) {
  const confirmedBy = r.addedBy?._id ?? r.addedBy?.id ?? r.addedBy ?? r.confirmedBy ?? '';
  return {
    ...r,
    id: r._id ?? r.id,
    tripId: r.trip ?? r.tripId,
    name: r.title ?? r.name,
    confirmedBy,
  };
}

export const reservationService = {
  async getReservations(tripId) {
    const res = await api.get(`/trips/${tripId}/reservations`) ;
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list.map(normalizeReservation);
  },

  async addReservation(tripId, data){
    const res = await api.post(`/trips/${tripId}/reservations`, data) ;
    return normalizeReservation(res.data);
  },

  async updateReservation(tripId, resId, data){
    const res = await api.patch(`/trips/${tripId}/reservations/${resId}`, data) ;
    return normalizeReservation(res.data);
  },

  async deleteReservation(tripId, resId) {
    await api.delete(`/trips/${tripId}/reservations/${resId}`);
  },
};
