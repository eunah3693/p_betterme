'use client';

import { create } from 'zustand';

type Location = {
  latitude?: number;
  longitude?: number;
  range?: number;
};

type StoreState = {
  location: Location;
  setLocation: (loc: Location) => void;
};

export const useStore = create<StoreState>((set) => ({
  location: { latitude: 34.743687, longitude: 127.6751029, range: 100 },
  setLocation: (loc) => set({ location: loc }),
}));