import type { LoginFormValues } from '@/lib/schemas/auth';

type LoginRequest = LoginFormValues;

type LoginResponse = {
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type SignupRequest = {
  email: string;
  password: string;
};

type SignupResponse = {
  user_id: string;
  email: string;
  access_token: string;
  expires_in: number;
};

type SendEmailCodeRequest = {
  email: string;
};

type SendEmailCodeResponse = {
  message: string;
  expires_in: number;
};

type VerifyEmailCodeRequest = {
  email: string;
  code: string;
};

type VerifyEmailCodeResponse = {
  verified: boolean;
  message: string;
};

type AuthErrorResponse = {
  message: string;
};

type LoginErrorResponse = AuthErrorResponse;

class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export { AuthError };
export type {
  AuthErrorResponse,
  LoginErrorResponse,
  LoginRequest,
  LoginResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
};
