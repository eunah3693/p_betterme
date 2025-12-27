import { create } from 'zustand';
import { isAuthenticated, UserData } from '@/lib/storage';

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  
  // 사용자 정보 설정
  setUser: (user) => set({ user }),
  
  // 인증 확인
  checkAuth: () => {
    const currentUser = isAuthenticated();
    set({ user: currentUser });
  },
  
  // 로그아웃
  logout: () => set({ user: null }),
}));