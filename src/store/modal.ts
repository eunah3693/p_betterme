import { create } from 'zustand';

export type ModalType = 'info' | 'success' | 'error' | 'warning';

interface ModalState {
  isOpen: boolean;
  message: string;
  type: ModalType;
  onConfirm: () => void;
}

interface ModalStore extends ModalState {
  showModal: (message: string, type?: ModalType, onConfirm?: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  message: '',
  type: 'info',
  onConfirm: () => {},
  
  showModal: (message, type = 'info', onConfirm) => {
    set({
      isOpen: true,
      message,
      type,
      onConfirm: onConfirm || (() => {}),
    });
  },
  
  closeModal: () => {
    set({ isOpen: false });
  },
}));


