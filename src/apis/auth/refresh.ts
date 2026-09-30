import { AuthError } from './error';
import { postAuth } from './request';

const REFRESH_PATH = '/api/auth/refresh';

type RefreshResponse = {
  access_token: string;
  expires_in: number;
  is_profile_completed: boolean;
};

async function refreshSession(): Promise<RefreshResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    throw new AuthError('로그인 정보가 없습니다', 401);
  }

  return postAuth<RefreshResponse>(REFRESH_PATH, {
    fallbackMessage: '로그인 정보를 갱신하지 못했습니다',
  });
}

export { refreshSession };
export type { RefreshResponse };
