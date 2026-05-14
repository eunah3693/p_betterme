import { create } from 'zustand';
import type { MemberItem } from '@/interfaces/member';

export type UserData = Omit<MemberItem, 'password'>;

interface UserStore {
  user: UserData | null;
  isAuthChecked: boolean;
  setAuthChecked: (state: boolean) => void;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const isBrowser = typeof window !== 'undefined';
const clearPersistedUser = () => {
  if (isBrowser) {
    localStorage.removeItem('user');
  }
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthChecked: false,

  // 서버 인증 확인 완료 여부 설정
  setAuthChecked: (state) => {
    set({ isAuthChecked: state });
  },

  // 사용자 정보 설정
  setUser: (user) => {
    clearPersistedUser();
    set({ user });
    // 로그인 상태 변경 이벤트 발생
    if (isBrowser) {
      window.dispatchEvent(new Event('auth-change'));
    }
  },

  // 로그아웃
  logout: () => {
    clearPersistedUser();
    set({ user: null, isAuthChecked: true });
    // 로그인 상태 변경 이벤트 발생
    if (isBrowser) {
      window.dispatchEvent(new Event('auth-change'));
    }
  },
}));


export const getUser = (): UserData | null => {
  return useUserStore.getState().user;
};


export const getUserState = (): UserStore => {
  return useUserStore.getState();
};


export const isLoggedIn = (): boolean => {
  return useUserStore.getState().user !== null;
};
