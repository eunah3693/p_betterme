import { useState } from 'react';

export type ModalType = 'info' | 'success' | 'error' | 'warning';

interface ModalState {
  isOpen: boolean;
  message: string;
  type: ModalType;
  onConfirm: () => void;
}

interface UseModalReturn {
  modal: ModalState;
  showModal: (message: string, type?: ModalType, onConfirm?: () => void) => void;
  closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  const showModal = (
    message: string,
    type: ModalType = 'info',
    onConfirm?: () => void
  ) => {
    setModal({
      isOpen: true,
      message,
      type,
      onConfirm: onConfirm || (() => {}),
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return { modal, showModal, closeModal };
};

