import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useAuthStore = create()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      token: null,

      login: (user, token = 'mock-token') => {
        set({ currentUser: user, isAuthenticated: true, token });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, token: null });
      },

      updateProfile: (updates) => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        }));
      },
    }),
    { name: 'tripsync-auth' }
  )
);
