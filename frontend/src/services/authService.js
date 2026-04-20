import api from './api';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.patch('/auth/me', data);
    return res.data;
  },

  async initiateGoogleLogin() {
    await signInWithRedirect(auth, googleProvider);
  },

  async handleGoogleRedirect() {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const idToken = await result.user.getIdToken();
    const res = await api.post('/auth/google', { idToken });
    return res.data;
  },
};
