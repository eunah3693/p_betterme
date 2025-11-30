import { DeviceType } from '@/interfaces/common';
import { create } from 'zustand';

interface ViewportState {
  width: number;
  height: number;
  isPc: boolean;
  deviceType: DeviceType | null;
  setViewport({
    width,
    height,
    isPc,
    deviceType,
  }: {
    width: number;
    height: number;
    isPc: boolean;
    deviceType: DeviceType;
  }): void;
}

export const useViewportStore = create<ViewportState>()((set) => ({
  width: 0,
  height: 0,
  isPc: false,
  deviceType: null,
  setViewport({ width, height, isPc, deviceType }) {
    set({
      width,
      height,
      isPc,
      deviceType,
    });
  },
}));
