import { ApiError } from '@/apis/baseClient';

class UserError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'UserError';
  }
}

export { UserError };
