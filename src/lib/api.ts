import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 에러 응답 
export const createErrorResponse = (
  res: NextApiResponse,
  statusCode: number,
  message: string,
  error?: string
) => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

// 성공 응답 
export const createSuccessResponse = <T>(
  res: NextApiResponse,
  data: T,
  message: string = 'Success'
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(200).json(response);
};

// HTTP 메서드 검증 함수
export const validateMethod = (
  req: NextApiRequest,
  allowedMethods: string[]
): boolean => {
  return allowedMethods.includes(req.method || '');
};


// API 핸들러 래퍼 함수 (에러 처리 자동화)
export const withErrorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      createErrorResponse(
        res,
        500,
        'Internal Server Error',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };
};
