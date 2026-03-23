import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Instructor } from '../types';
import instructorsData from '../data/instructors.json';

const instructors = instructorsData as Instructor[];

interface AuthState {
  currentInstructor: Instructor | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentInstructor: null,
      login: (email, password) => {
        const found = instructors.find(
          (i) => i.email === email && i.password === password
        );
        if (found) {
          set({ currentInstructor: found });
          return true;
        }
        return false;
      },
      logout: () => set({ currentInstructor: null }),
    }),
    { name: 'matchappoint-auth' }
  )
);
