import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ─── Request interceptor — attach JWT token ───────────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — extract response.data ────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Try again.';

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (status === 403) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('You do not have permission to do that');
      });
    } else if (status === 500) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Something went wrong. Try again.');
      });
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
