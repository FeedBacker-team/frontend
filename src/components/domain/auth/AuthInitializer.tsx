'use client';

import { useEffect } from 'react';

import { refreshAuthSession } from '@/lib/auth/refreshSession';
import { setAuthSessionInitializing } from '@/lib/auth/session';

let hasStartedInitialization = false;

function AuthInitializer() {
  useEffect(() => {
    if (hasStartedInitialization) {
      return;
    }

    hasStartedInitialization = true;
    setAuthSessionInitializing();

    void refreshAuthSession().catch(() => {
      // refresh 실패 시 refreshAuthSession에서 비로그인 상태로 전환한다.
    });
  }, []);

  return null;
}

export { AuthInitializer };
