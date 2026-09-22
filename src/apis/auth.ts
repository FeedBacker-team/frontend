import {
  AuthError,
  type LoginRequest,
  type LoginResponse,
  type SendEmailCodeRequest,
  type SendEmailCodeResponse,
  type SignupRequest,
  type SignupResponse,
  type VerifyEmailCodeRequest,
  type VerifyEmailCodeResponse,
} from '@/types/auth';

const AUTH_PATHS = {
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  sendEmailCode: '/api/auth/email/send',
  verifyEmailCode: '/api/auth/email/verify',
} as const;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockLoginResponse(email: string): LoginResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    email,
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
  };
}

function getMockSignupResponse(email: string): SignupResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    email,
    access_token: 'mock-access-token',
    expires_in: 900,
  };
}

async function parseAuthError(response: Response, fallbackMessage: string) {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }
  } catch {
    // 에러 body가 JSON이 아닌 경우
  }

  return fallbackMessage;
}

async function postAuth<T>(
  path: string,
  body: unknown,
  fallbackMessage: string
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error('API base URL is required');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new AuthError(
      await parseAuthError(response, fallbackMessage),
      response.status
    );
  }

  return response.json();
}

async function login(body: LoginRequest): Promise<LoginResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return getMockLoginResponse(body.email);
  }

  return postAuth<LoginResponse>(
    AUTH_PATHS.login,
    body,
    '로그인에 실패했습니다'
  );
}

async function sendEmailVerification(
  body: SendEmailCodeRequest
): Promise<SendEmailCodeResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return {
      message: '인증번호가 발송되었습니다.',
      expires_in: 180,
    };
  }

  return postAuth<SendEmailCodeResponse>(
    AUTH_PATHS.sendEmailCode,
    body,
    '인증번호 발송에 실패했습니다'
  );
}

async function verifyEmailCode(
  body: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return {
      verified: true,
      message: '이메일 인증이 완료되었습니다.',
    };
  }

  return postAuth<VerifyEmailCodeResponse>(
    AUTH_PATHS.verifyEmailCode,
    body,
    '이메일 인증이 완료되지 않았습니다'
  );
}

async function signup(body: SignupRequest): Promise<SignupResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return getMockSignupResponse(body.email);
  }

  return postAuth<SignupResponse>(
    AUTH_PATHS.signup,
    body,
    '회원가입에 실패했습니다'
  );
}

export { login, sendEmailVerification, signup, verifyEmailCode };
