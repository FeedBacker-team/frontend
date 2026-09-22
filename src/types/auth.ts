import type { LoginFormValues } from '@/lib/schemas/auth';

type LoginRequest = LoginFormValues;

type LoginResponse = {
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type LoginErrorResponse = {
  message: string;
};

class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export { AuthError };
export type { LoginErrorResponse, LoginRequest, LoginResponse };
