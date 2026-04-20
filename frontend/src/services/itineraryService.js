import api from './api';

function normalizeActivity(a) {
  return {
    ...a,
    id: a._id ?? a.id,
    dayId: a.day?._id ?? (typeof a.day === 'string' ? a.day : undefined) ?? a.dayId,
    time: a.startTime ?? a.time ?? '',
    commentCount: a.commentCount ?? 0,
  };
}

function normalizeDay(d) {
  return {
    ...d,
    id: d._id ?? d.id,
    tripId: d.trip ?? d.tripId,
    activities: (d.activities ?? []).map(normalizeActivity),
  };
}

export const itineraryService = {
  async getItinerary(tripId) {
    const res = await api.get(`/trips/${tripId}/itinerary`);
    return (res.data ?? []).map(normalizeDay);
  },

  async addDay(tripId, date) {
    const res = await api.post(`/trips/${tripId}/itinerary/days`, { date });
    return normalizeDay(res.data);
  },

  async updateDay(tripId, dayId, data) {
    const res = await api.patch(`/trips/${tripId}/itinerary/days/${dayId}`, data) ;
    return normalizeDay(res.data);
  },

  async deleteDay(tripId, dayId) {
    await api.delete(`/trips/${tripId}/itinerary/days/${dayId}`);
  },

  async addActivity(tripId, dayId, data) {
    const { time, ...rest } = data;
    const res = await api.post(`/trips/${tripId}/itinerary/days/${dayId}/activities`, { ...rest, startTime: time });
    return normalizeActivity(res.data);
  },

  async updateActivity(tripId, activityId, data) {
    const res = await api.patch(`/trips/${tripId}/itinerary/activities/${activityId}`, data);
    return normalizeActivity(res.data);
  },

  async deleteActivity(tripId, activityId) {
    await api.delete(`/trips/${tripId}/itinerary/activities/${activityId}`);
  },

  async reorderActivities(tripId, dayId, orderedIds) {
    await api.post(`/trips/${tripId}/itinerary/days/${dayId}/reorder`, { orderedIds });
  },
};
