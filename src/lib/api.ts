import { NextApiRequest, NextApiResponse } from 'next';
import { UnauthorizedError, ForbiddenError, NotFoundError, ValidationError } from '@/lib/errors';

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
      
      // 에러 타입에 따라 상태 코드 결정
      let statusCode = 500;
      if (error instanceof UnauthorizedError) {
        statusCode = 401;
      } else if (error instanceof ForbiddenError) {
        statusCode = 403;
      } else if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof ValidationError) {
        statusCode = 400;
      }
      
      const message = error instanceof Error ? error.message : 'Unknown error';
      createErrorResponse(
        res,
        statusCode,
        message,
        message
      );
    }
  };
};
