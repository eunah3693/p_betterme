import type { MemberItem } from '@/interfaces/member';

const STORAGE_KEYS = {
  USER: 'user',
} as const;

const isBrowser = typeof window !== 'undefined';

export type UserData = Omit<MemberItem, 'password'>;

//user 정보를 localStorage에 저장
export const setUser = (user: UserData): void => {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('auth-change'));
  }
};

//localStorage에서 user 정보를 가져옴
export const getUser = (): UserData | null => {
  if (isBrowser) {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr) as UserData;
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
        return null;
      }
    }
  }
  return null;
};

//localStorage에서 user 정보를 제거
export const removeUser = (): void => {
  if (isBrowser) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('auth-change'));
  }
};

//localStorage에서 user 정보가 있는지 확인
export const isAuthenticated = (): boolean => {
  return !!getUser();
};
