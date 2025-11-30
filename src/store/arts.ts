import { create } from 'zustand';
import { ArtFilter } from '@/interfaces/arts';

type ArtFilterStore = {
  filter: ArtFilter;
  setFilter: (f: ArtFilter) => void;
  resetFilter: () => void;
};

export const useArtFilterStore = create<ArtFilterStore>((set) => ({
  filter: {},
  setFilter: (f) => {
    console.log(f);
    set({ filter: f })
  },
  resetFilter: () => set({ filter: {} }),
}));