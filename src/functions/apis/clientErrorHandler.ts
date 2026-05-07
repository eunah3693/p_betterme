'use client';

import { paths } from '@/constants/paths';
import { useUserStore } from '@/store/user';
import { useWebUtilStore } from '@/store/webUtil';
import { ApiError } from './fetch';

const SILENT_STATUS_CODES = new Set([400, 404, 500]);

const getErrorData = (error: ApiError): Record<string, unknown> => {
  if (error.data && typeof error.data === 'object') {
    return error.data as Record<string, unknown>;
  }

  return {};
};

const getClientErrorMessage = (error: ApiError) => {
  const errorData = getErrorData(error);
  const message =
    errorData.translate ||
    errorData.error ||
    errorData.message ||
    error.message;

  return typeof message === 'string' ? message : '오류가 발생했습니다';
};

export const handleApiClientError = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    console.error('API 요청 실패:', error);
    return;
  }

  if (!SILENT_STATUS_CODES.has(error.statusCode)) {
    useWebUtilStore.getState().setSnackBar({
      message: getClientErrorMessage(error),
      icon: 'error',
    });
  }

  if (error.statusCode === 401 || error.statusCode === 403) {
    useUserStore.getState().logout();
    window.location.href = paths.LOGIN;
    return;
  }

  console.error('API 요청 실패:', error);
};
