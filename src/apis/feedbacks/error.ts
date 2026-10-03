import { ApiError } from '@/apis/baseClient';

class FeedbackError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'FeedbackError';
  }
}

export { FeedbackError };
