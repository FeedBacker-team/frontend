import 'client-only';

import { tokenManager } from '@/lib/auth/tokenManager';
import { useAuthStore } from '@/stores/authStore';

type AuthSession = {
  accessToken: string;
  isProfileCompleted: boolean;
};

function establishAuthSession({
  accessToken,
  isProfileCompleted,
}: AuthSession) {
  tokenManager.set(accessToken);
  useAuthStore.getState().setAuthenticated(isProfileCompleted);
}

function clearAuthSession() {
  tokenManager.clear();
  useAuthStore.getState().setUnauthenticated();
}

function setAuthSessionInitializing() {
  tokenManager.clear();
  useAuthStore.getState().setInitializing();
}

function completeAuthProfile() {
  useAuthStore.getState().setProfileCompleted(true);
}

export {
  clearAuthSession,
  completeAuthProfile,
  establishAuthSession,
  setAuthSessionInitializing,
};
export type { AuthSession };
