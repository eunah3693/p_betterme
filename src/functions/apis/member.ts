import { axiosInstance } from './axios';
import { SignupRequest, LoginRequest, MemberResponse, CheckIdResponse } from '@/interfaces/member';

const MEMBER_URL = '/api/member';

// 아이디 중복 체크
export const checkId = async (id: string): Promise<CheckIdResponse> => {
  try {
    const { data } = await axiosInstance.get<CheckIdResponse>(`${MEMBER_URL}?id=${id}`);
    return data;
  } catch (error) {
    console.error('아이디 중복 체크 실패:', error);
    throw error;
  }
};

// 회원가입
export const signup = async (signupData: SignupRequest): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.post<MemberResponse>(MEMBER_URL, signupData);
    return data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// 로그인
export const login = async (loginData: LoginRequest): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.post<MemberResponse>(MEMBER_URL, {
      ...loginData,
      action: 'login'
    });
    return data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 회원 정보 조회
export const getMemberInfo = async (idx: number): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.get<MemberResponse>(`${MEMBER_URL}?idx=${idx}`);
    return data;
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
    throw error;
  }
};

// 회원 정보 수정
export const updateMemberInfo = async (updateData: {
  idx: number;
  job?: string;
  jobInfo?: string;
  myBadge?: string;
}): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.put<MemberResponse>(MEMBER_URL, updateData);
    return data;
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    throw error;
  }
};

