import { create } from 'zustand';

export const useTripStore = create((set) => ({
  activeTrip: null,
  userRole: null,

  setActiveTrip: (trip, role = null) => {
    set({ activeTrip: trip, userRole: role });
  },

  clearActiveTrip: () => {
    set({ activeTrip: null, userRole: null });
  },
}));
