import { create } from 'zustand';

type ToastIcon = 'success' | 'error' | 'warn' | 'point';

interface LoadingState {
  visible: boolean;
  message: string;
}

interface SnackBarState {
  message: string;
  icon?: ToastIcon;
}

interface WebUtilState {
  loading: LoadingState;
  snackBar: SnackBarState;
  setLoading(loading: LoadingState): void;
  resetLoading(loading: LoadingState): void;
  setSnackBar(snackBar: SnackBarState): void;
  resetSnackBar(): void;
}

export const useWebUtilStore = create<WebUtilState>()((set) => ({
  loading: {
    visible: false,
    message: '',
  },
  snackBar: {
    message: '',
  },
  setLoading(loading) {
    set({ loading });
  },
  resetLoading() {
    set({
      loading: {
        visible: false,
        message: '',
      },
    });
  },
  setSnackBar(snackBar) {
    set({ snackBar });
  },
  resetSnackBar() {
    set({
      snackBar: {
        message: '',
      },
    });
  },
}));
