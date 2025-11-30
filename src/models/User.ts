// 사용자 데이터 모델 (선택사항)
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// 사용자 생성/수정용 모델
export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  role?: 'user' | 'admin';
}

// 사용자 업데이트용 모델
export interface UserUpdateInput extends Partial<UserCreateInput> {
  id: number;
}

// 인증 토큰 모델
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 로그인 요청 모델
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 모델
export interface LoginResponse {
  user: User;
  token: AuthToken;
}
