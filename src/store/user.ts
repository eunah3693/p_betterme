import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemberItem } from '@/interfaces/member';

export type UserData = Omit<MemberItem, 'password'>;

interface UserStore {
  user: UserData | null;
  _hasHydrated: boolean; // localStorage 복원 완료 여부
  setHasHydrated: (state: boolean) => void;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const isBrowser = typeof window !== 'undefined';

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      _hasHydrated: false,
      
      // Hydration 상태 설정
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      
      // 사용자 정보 설정
      setUser: (user) => {
        set({ user });
        // 로그인 상태 변경 이벤트 발생
        if (isBrowser && user) {
          window.dispatchEvent(new Event('auth-change'));
        }
      },
      
      // 로그아웃
      logout: () => {
        set({ user: null });
        // 로그인 상태 변경 이벤트 발생
        if (isBrowser) {
          window.dispatchEvent(new Event('auth-change'));
        }
      },
    }),
    {
      name: 'user', // localStorage key 이름
      onRehydrateStorage: () => (state) => {
        // localStorage에서 데이터 복원 완료 시 호출
        state?.setHasHydrated(true);
      },
    }
  )
);