import { NextApiRequest, NextApiResponse } from 'next';
import { UnauthorizedError, ForbiddenError, NotFoundError, ValidationError } from '@/lib/errors';
import { verifyToken, JwtPayload } from '@/lib/jwt';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 인증된 요청에 사용자 정보 추가
export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload;
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

// Cookie에서 토큰 추출
export const getTokenFromCookie = (req: NextApiRequest): string | null => {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
  if (!tokenCookie) return null;

  return tokenCookie.split('=')[1];
};

// 요청에서 사용자 인증 정보 추출
export const authenticateRequest = (req: AuthenticatedRequest): JwtPayload => {
  const token = getTokenFromCookie(req);
  
  if (!token) {
    throw new UnauthorizedError('로그인이 필요합니다.');
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    throw new UnauthorizedError('유효하지 않은 토큰입니다.');
  }

  req.user = payload;
  return payload;
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
