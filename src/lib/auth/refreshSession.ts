import 'client-only';

import {
  refreshSession,
  type RefreshResponse,
} from '@/apis/auth/refresh';
import {
  clearAuthSession,
  establishAuthSession,
} from '@/lib/auth/session';

let refreshPromise: Promise<RefreshResponse> | null = null;

function refreshAuthSession() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshSession()
    .then((data) => {
      establishAuthSession({
        accessToken: data.access_token,
        isProfileCompleted: data.is_profile_completed,
      });

      return data;
    })
    .catch((error: unknown) => {
      clearAuthSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export { refreshAuthSession };
