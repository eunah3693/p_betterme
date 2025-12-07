// 인증 에러 (401)
export class UnauthorizedError extends Error {
  constructor(message: string = '인증이 필요합니다.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// 권한 없음 에러 (403)
export class ForbiddenError extends Error {
  constructor(message: string = '권한이 없습니다.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// 찾을 수 없음 에러 (404)
export class NotFoundError extends Error {
  constructor(message: string = '리소스를 찾을 수 없습니다.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// 유효성 검사 에러 (400)
export class ValidationError extends Error {
  constructor(message: string = '유효하지 않은 요청입니다.') {
    super(message);
    this.name = 'ValidationError';
  }
}
