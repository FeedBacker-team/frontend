import { apiRequest } from '@/apis/client';

import { AuthError } from './error';

const LOGOUT_PATH = '/api/auth/logout';

async function logout(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return;
  }

  return apiRequest<void>(LOGOUT_PATH, {
    method: 'POST',
    fallbackMessage: '로그아웃에 실패했습니다',
    responseType: 'void',
    errorFactory: (message, status) => new AuthError(message, status),
  });
}

export { logout };
