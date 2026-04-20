import api from './api';

function normalizeExpense(e) {
  const paidBy = e.paidBy?._id ?? e.paidBy?.id ?? e.paidBy ?? '';
  return { ...e, id: e._id ?? e.id, tripId: e.trip ?? e.tripId, paidBy: String(paidBy) };
}

export const expenseService = {
  async getExpenses(tripId) {
    const res = await api.get(`/trips/${tripId}/expenses`);
    return { expenses: (res.data ?? []).map(normalizeExpense), summary: {} };
  },

  async addExpense(tripId, data) {
    const res = await api.post(`/trips/${tripId}/expenses`, data);
    return normalizeExpense(res.data);
  },

  async updateExpense(tripId, expenseId, data) {
    const res = await api.patch(`/trips/${tripId}/expenses/${expenseId}`, data);
    return normalizeExpense(res.data);
  },

  async deleteExpense(tripId, expenseId) {
    await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
  },
};
