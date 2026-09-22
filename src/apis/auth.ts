import { AuthError, type LoginRequest, type LoginResponse } from '@/types/auth';

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

async function parseLoginError(response: Response) {
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

  return '로그인에 실패했습니다';
}

async function login(body: LoginRequest): Promise<LoginResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return getMockLoginResponse(body.email);
  }

  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new AuthError(await parseLoginError(response), response.status);
  }

  return response.json();
}

export { login };
