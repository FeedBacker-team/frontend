'use client';

import { create } from 'zustand';

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  isProfileCompleted: boolean;
  setInitializing: () => void;
  setAuthenticated: (isProfileCompleted: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
  setUnauthenticated: () => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  status: 'initializing',
  isProfileCompleted: false,

  setInitializing: () => {
    set({ status: 'initializing', isProfileCompleted: false });
  },

  setAuthenticated: (isProfileCompleted) => {
    set({ status: 'authenticated', isProfileCompleted });
  },

  setProfileCompleted: (isProfileCompleted) => {
    set({ isProfileCompleted });
  },

  setUnauthenticated: () => {
    set({ status: 'unauthenticated', isProfileCompleted: false });
  },
}));

export { useAuthStore };
export type { AuthState, AuthStatus };
