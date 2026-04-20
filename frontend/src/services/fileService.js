import api from './api';

function normalizeFile(f) {
  return {
    ...f,
    id: f._id ?? f.id,
    tripId: f.trip ?? f.tripId,
    uploadedBy: f.uploadedBy?._id ?? f.uploadedBy?.id ?? f.uploadedBy ?? '',
    uploadedAt: f.uploadedAt ?? f.createdAt ?? '',
  };
}

export const fileService = {
  async getFiles(tripId) {
    const res = await api.get(`/trips/${tripId}/files`);
    return (res.data ?? []).map(normalizeFile);
  },

  // Do NOT set Content-Type manually — Axios handles multipart boundary automatically
  async uploadFile(tripId, formData) {
    const res = await api.post(`/trips/${tripId}/files`, formData) ;
    return normalizeFile(res.data);
  },

  async deleteFile(tripId, fileId) {
    await api.delete(`/trips/${tripId}/files/${fileId}`);
  },
};
