import { apiRequest, type ApiRequestOptions } from '@/apis/client';

import { ProjectError } from './error';

type ProjectRequestOptions = Omit<ApiRequestOptions, 'errorFactory'>;

function projectRequest<T>(path: string, options: ProjectRequestOptions) {
  return apiRequest<T>(path, {
    ...options,
    errorFactory: (message, status) => new ProjectError(message, status),
  });
}

export { projectRequest };
