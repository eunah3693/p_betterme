import { create } from 'zustand';
import { getUser, UserData, setUser as saveUser, removeUser } from '@/lib/storage';

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  
  // 사용자 정보 설정
  setUser: (user) => {
    if (user) {
      saveUser(user); 
    }
    set({ user });
  },
  
  // 인증 확인 
  checkAuth: () => {
    const currentUser = getUser(); 
    set({ user: currentUser });
  },
  
  // 로그아웃
  logout: () => {
    removeUser();  
    set({ user: null });
  },
}));