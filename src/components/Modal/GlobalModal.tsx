import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useModalStore } from '@/store/modal';

/**
 * 전역 모달 컴포넌트
 * _app.tsx에 한 번만 추가하면 어디서든 사용 가능
 */
export const GlobalModal = () => {
  const { isOpen, message, type, onConfirm, closeModal } = useModalStore();

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      onConfirm={onConfirm}
      message={message}
      type={type}
    />
  );
};


