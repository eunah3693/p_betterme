export interface MemberItem {
  idx: number;
  id: string;
  password: string;
  nickname: string;
  job: string;
  jobInfo: string;
  myBadge: string;
}

export interface SignupRequest {
  id: string;
  password: string;
  nickname: string;
  job: string;
  jobInfo: string;
  myBadge: string; // 쉼표로 구분된 배지 문자열
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface CheckIdRequest {
  id: string;
}

export interface MemberResponse {
  success: boolean;
  data: MemberItem | null;
  message?: string;
}

export interface CheckIdResponse {
  success: boolean;
  available: boolean;
  message?: string;
}

