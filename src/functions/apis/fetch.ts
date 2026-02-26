import { useWebUtilStore } from '@/store/webUtil';
import Router from 'next/router';
import { paths } from '@/constants/paths';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ROOT_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  noCache?: boolean;
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, noCache, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    url += `?${queryString}`;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...(noCache && { cache: 'no-store' }),
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (typeof window !== 'undefined') {
        const { setSnackBar } = useWebUtilStore.getState();

        if (
          errorData.statusCode !== 404 &&
          errorData.statusCode !== 400 &&
          errorData.statusCode !== 500
        ) {
          setSnackBar({
            message: errorData.translate || errorData.message || '오류가 발생했습니다',
            icon: 'error',
          });
        }

        if (errorData.statusCode === 403) {
          localStorage.removeItem('session');
          Router.push(paths.LOGIN);
        }
      }

      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: unknown, noCache?: boolean) =>
    request<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      noCache,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'DELETE', params }),
};
