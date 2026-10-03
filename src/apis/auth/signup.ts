import { postAuth } from './request';

const SIGNUP_PATH = '/api/auth/signup';

type SignupRequest = {
  email: string;
  password: string;
};

type SignupResponse = {
  user_id: string;
  email: string;
  access_token: string;
  expires_in: number;
  is_profile_completed: boolean;
};

function getMockSignupResponse(email: string): SignupResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    email,
    access_token: 'mock-access-token',
    expires_in: 900,
    is_profile_completed: false,
  };
}

async function signup(body: SignupRequest): Promise<SignupResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockSignupResponse(body.email);
  }

  return postAuth<SignupResponse>(SIGNUP_PATH, {
    body,
    fallbackMessage: '회원가입에 실패했습니다',
  });
}

export { signup };
export type { SignupRequest, SignupResponse };
