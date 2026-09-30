import { ApiError } from '@/apis/baseClient';

class ProjectError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'ProjectError';
  }
}

export { ProjectError };
