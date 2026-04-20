import api from './api';

function normalizeComment(c) {
  const authorId = c.author?._id ?? c.author?.id ?? c.author ?? c.authorId ?? '';
  return {
    ...c,
    id: c._id ?? c.id,
    authorId: String(authorId),
    body: c.text ?? c.body,
  };
}

export const commentService = {
  async getComments(tripId, refType, refId) {
    const res = await api.get(`/trips/${tripId}/comments`, {
      params: { refType, refId },
    });
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list.map(normalizeComment);
  },

  async addComment(tripId, data) {
    const res = await api.post(`/trips/${tripId}/comments`, data);
    return normalizeComment(res.data);
  },

  async updateComment(tripId, commentId, text) {
    const res = await api.patch(`/trips/${tripId}/comments/${commentId}`, { text });
    return normalizeComment(res.data);
  },

  async deleteComment(tripId, commentId) {
    await api.delete(`/trips/${tripId}/comments/${commentId}`);
  },
};
