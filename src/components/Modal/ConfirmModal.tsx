import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Buttons/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  type?: 'info' | 'success' | 'error' | 'warning';
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
  showCancel = false,
  type = 'info',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const buttonColors = {
    info: 'bgMain',
    success: 'bgMain',
    error: 'bgDanger',
    warning: 'bgCaution',
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 max-w-[400px] w-[90%] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>
            
            <div className="flex gap-3 justify-end">
              {showCancel && (
                <Button
                  type="button"
                  size="md"
                  color="bMain"
                  onClick={onClose}
                >
                  {cancelText}
                </Button>
              )}
              <Button
                type="button"
                size="md"
                color={buttonColors[type]}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
