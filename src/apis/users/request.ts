import { apiRequest, type ApiRequestOptions } from '@/apis/client';

import { UserError } from './error';

type UserRequestOptions = Omit<ApiRequestOptions, 'errorFactory'>;

function userRequest<T>(path: string, options: UserRequestOptions) {
  return apiRequest<T>(path, {
    ...options,
    errorFactory: (message, status) => new UserError(message, status),
  });
}

export { userRequest };
