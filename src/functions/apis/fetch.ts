interface FetchOptions extends RequestInit {
  params?: object;
  noCache?: boolean;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
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

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type') ?? '';
  const isJsonResponse = contentType.includes('application/json');
  const responseData = isJsonResponse
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => '');

  if (!response.ok) {
    const errorData =
      responseData && typeof responseData === 'object'
        ? responseData as Record<string, unknown>
        : {};
    const statusCode = 'statusCode' in errorData
      ? Number(errorData.statusCode)
      : response.status;
    const errorMessage = errorData.error ?? errorData.message;
    const message =
      typeof errorMessage === 'string'
        ? errorMessage
        : (typeof responseData === 'string' && responseData) ||
          `HTTP Error: ${response.status}`;

    throw new ApiError(message, statusCode, responseData);
  }

  return responseData as T;
}

export const api = {
  get: <T>(endpoint: string, params?: object) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: unknown, noCache?: boolean) =>
    request<T>(endpoint, { 
      method: 'POST', 
      body: data !== undefined ? JSON.stringify(data) : undefined,
      noCache,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { 
      method: 'PUT', 
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, params?: object) =>
    request<T>(endpoint, { method: 'DELETE', params }),
};
