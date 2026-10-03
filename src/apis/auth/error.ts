import { ApiError } from '@/apis/baseClient';

class AuthError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'AuthError';
  }
}

export { AuthError };
