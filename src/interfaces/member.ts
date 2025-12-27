export interface MemberItem {
  idx: number;
  id: string;
  password: string;
  nickname: string;
  job: string;
  jobInfo: string;
  myBadge: string;
}

export type UserData = Omit<MemberItem, 'password'>;

export interface SignupRequest {
  id: string;
  password: string;
  nickname: string;
  job: string;
  jobInfo: string;
  myBadge: string; // 쉼표로 구분된 배지 문자열
}

//로그인 요청
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

//로그인 응답 
export interface LoginResponse {
  success: boolean;
  data: Omit<MemberItem, 'password'> | null;
  token?: string;
  message?: string;
}

export interface UpdateMemberRequest {
  nickname?: string;
  job?: string;
  jobInfo?: string;
  myBadge?: string;
}

export interface CheckIdResponse {
  success: boolean;
  available: boolean;
  message?: string;
}

