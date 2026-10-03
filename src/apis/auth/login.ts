import { postAuth } from './request';

const LOGIN_PATH = '/api/auth/login';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  user_id: string;
  email: string;
  access_token: string;
  expires_in: number;
  is_profile_completed: boolean;
};

function getMockLoginResponse(email: string): LoginResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    email,
    access_token: 'mock-access-token',
    expires_in: 3600,
    is_profile_completed: true,
  };
}

async function login(body: LoginRequest): Promise<LoginResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockLoginResponse(body.email);
  }

  return postAuth<LoginResponse>(LOGIN_PATH, {
    body,
    fallbackMessage: '로그인에 실패했습니다',
  });
}

export { login };
export type { LoginRequest, LoginResponse };
