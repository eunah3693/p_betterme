import { useWebUtilStore } from '@/store/webUtil';
import { paths } from '@/constants/paths';

interface FetchOptions extends RequestInit {
  params?: object;
  noCache?: boolean;
}

const getBaseURL = () =>
  typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_API_ROOT_URL ?? 'http://localhost:3000');

const buildUrl = (
  endpoint: string,
  params?: object
) => {
  const baseUrl = getBaseURL();

  if (!params) {
    return `${baseUrl}${endpoint}`;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  if (!queryString) {
    return `${baseUrl}${endpoint}`;
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  return `${baseUrl}${endpoint}${separator}${queryString}`;
};

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, noCache, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);

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
    const contentType = response.headers.get('content-type') ?? '';
    const isJsonResponse = contentType.includes('application/json');
    const responseData = isJsonResponse
      ? await response.json().catch(() => ({}))
      : await response.text().catch(() => '');

    if (!response.ok) {
      const errorData =
        responseData && typeof responseData === 'object'
          ? responseData
          : {};
      const statusCode = 'statusCode' in errorData
        ? Number(errorData.statusCode)
        : response.status;
      
      if (typeof window !== 'undefined') {
        const { setSnackBar } = useWebUtilStore.getState();

        if (
          statusCode !== 404 &&
          statusCode !== 400 &&
          statusCode !== 500
        ) {
          setSnackBar({
            message:
              errorData.translate ||
              errorData.error ||
              errorData.message ||
              '오류가 발생했습니다',
            icon: 'error',
          });
        }

        if (statusCode === 403) {
          localStorage.removeItem('session');
          window.location.href = paths.LOGIN;
        }
      }

      throw new Error(
        errorData.error ||
        errorData.message ||
        (typeof responseData === 'string' && responseData) ||
        `HTTP Error: ${response.status}`
      );
    }

    return responseData as T;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, params?: object) =>
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

  delete: <T>(endpoint: string, params?: object) =>
    request<T>(endpoint, { method: 'DELETE', params }),
};
