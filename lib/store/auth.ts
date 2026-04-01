import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'teacher' | 'student';

export interface UserAccount {
  username: string;
  password: string; // Plaintext for mockup
  role: UserRole;
  nickname?: string;
  grade?: string;
}

export interface AuthState {
  role: UserRole;
  isLoggedIn: boolean;
  username: string;
  nickname: string;
  grade: string;
  users: UserAccount[];
  
  setRole: (role: UserRole) => void;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, nickname: string, grade: string, role?: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: 'student', // Default to student
      isLoggedIn: false,
      username: '',
      nickname: '',
      grade: '',
      users: [], // Simulated database
      
      setRole: (role) => set({ role }),
      
      login: (username, password) => {
        const { users } = get();
        const user = users.find(u => u.username === username);
        if (!user) throw new Error('用户不存在, 请先注册');
        if (user.password !== password) throw new Error('密码错误');
        
        set({ 
          isLoggedIn: true, 
          username: user.username, 
          role: user.role,
          nickname: user.nickname || '',
          grade: user.grade || ''
        });
      },
      
      register: (username, password, nickname, grade, role = 'student') => {
        if (!username.trim() || !password.trim()) throw new Error('用户名和密码不能为空');
        if (!nickname.trim() || !grade.trim()) throw new Error('昵称和年级不能为空');
        
        const { users } = get();
        if (users.find(u => u.username === username)) {
          throw new Error('用户名已存在');
        }
        
        const newUser: UserAccount = { username, password, nickname, grade, role };
        set({ 
          users: [...users, newUser], 
          isLoggedIn: true, 
          username, 
          nickname,
          grade,
          role 
        });
      },
      
      logout: () => set({ isLoggedIn: false, username: '', nickname: '', grade: '', role: 'student' }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
