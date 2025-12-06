interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

function ErrorMessage({
  message = '데이터를 불러오는데 실패했습니다.',
  onRetry,
  retryButtonText = '다시 시도',
}: ErrorMessageProps) {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="text-center text-red-500">
        <p>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-main text-white rounded hover:bg-main/90 transition-colors"
          >
            {retryButtonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
