import api from './api';

function normalizeItem(item) {
  return {
    id: item._id ?? item.id,
    label: item.text ?? item.label,
    completed: item.completed,
  };
}

function normalizeChecklist(c) {
  return {
    ...c,
    id: c._id ?? c.id,
    tripId: c.trip ?? c.tripId,
    items: (c.items ?? []).map(normalizeItem),
  };
}

export const checklistService = {
  async getChecklists(tripId) {
    const res = await api.get(`/trips/${tripId}/checklists`) ;
    const list = (res.data ?? []).map(normalizeChecklist);
    const empty = (type) => ({ id: '', tripId, type, items: [] });
    return {
      packing: list.find((c) => c.type === 'packing') ?? empty('packing'),
      todo: list.find((c) => c.type === 'todo') ?? empty('todo'),
    };
  },

  async addItem(tripId, type, text) {
    const res = await api.post(`/trips/${tripId}/checklists/${type}/items`, { text });
    return normalizeChecklist(res.data);
  },

  async updateItem(tripId, type, itemId, data) {
    const res = await api.patch(`/trips/${tripId}/checklists/${type}/items/${itemId}`, data) ;
    return normalizeChecklist(res.data);
  },

  async deleteItem(tripId, type, itemId) {
    await api.delete(`/trips/${tripId}/checklists/${type}/items/${itemId}`);
  },
};
