import { z } from 'zod';

// 회원 관련 유효성 검사 스키마
export const memberValidation = {
  // ID 검증
  id: z.string()
    .min(4, '아이디는 최소 4자 이상이어야 합니다')
    .max(20, '아이디는 최대 20자까지 가능합니다')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 밑줄만 사용 가능합니다'),

  // 비밀번호 검증
  password: z.string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자까지 가능합니다'),

  // 닉네임 검증
  nickname: z.string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(10, '닉네임은 최대 10자까지 가능합니다'),
};

// ID 체크 요청 스키마
export const checkIdSchema = z.object({
  id: memberValidation.id,
});

// 회원가입 요청 스키마
export const signupSchema = z.object({
  id: memberValidation.id,
  password: memberValidation.password,
  nickname: memberValidation.nickname,
  job: z.string().optional(),
  jobInfo: z.string().optional(),
  myBadge: z.string().optional(),
});

// 로그인 요청 스키마
export const loginSchema = z.object({
  id: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});
