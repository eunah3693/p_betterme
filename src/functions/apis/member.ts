import { axiosInstance } from './axios';
import { SignupRequest, LoginRequest, LoginResponse, MemberResponse, CheckIdResponse , GetMemberInfoRequest, UpdateMemberRequest} from '@/interfaces/member';

const MEMBER_URL = '/api/member';
const CHECK_ID_URL = `${MEMBER_URL}/check-id`;
const SIGNUP_URL = `${MEMBER_URL}/signup`;
const LOGIN_URL = `${MEMBER_URL}/login`;

// 아이디 중복 체크
export const checkId = async (id: string): Promise<CheckIdResponse> => {
  try {
    const { data } = await axiosInstance.get<CheckIdResponse>(`${CHECK_ID_URL}?id=${id}`);
    return data;
  } catch (error) {
    console.error('아이디 중복 체크 실패:', error);
    throw error;
  }
};

// 회원가입
export const signup = async (signupData: SignupRequest): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.post<MemberResponse>(SIGNUP_URL, signupData);
    return data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// 로그인
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const { data } = await axiosInstance.post<LoginResponse>(LOGIN_URL, loginData);
    return data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 회원 정보 조회
export const getMemberInfo = async (params: GetMemberInfoRequest): Promise<MemberResponse> => {
  try {
    const { data } = await axiosInstance.get<MemberResponse>(`${MEMBER_URL}/${params.idx}`);
    console.log('회원 정보 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
    throw error;
  }
};

// 회원 정보 수정
export const updateMemberInfo = async (updateData: UpdateMemberRequest): Promise<MemberResponse> => {
  try {
    const { idx, ...body } = updateData;
    const { data } = await axiosInstance.put<MemberResponse>(`${MEMBER_URL}/${idx}/update`, body);
    return data;
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    throw error;
  }
};

