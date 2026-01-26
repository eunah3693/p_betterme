import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '7d'; // 7일

export interface JwtPayload {
  idx: number;
  id: string;
  nickname: string;
}

// JWT 토큰 생성
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// JWT 토큰 검증
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// 토큰에서 payload 추출 (검증 없이)
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}
