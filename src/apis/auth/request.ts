import { baseApiRequest } from '@/apis/baseClient';

import { AuthError } from './error';

type PostAuthOptions = {
  body?: unknown;
  fallbackMessage: string;
  responseType?: 'json' | 'void';
};

function postAuth<T>(
  path: string,
  { body, fallbackMessage, responseType }: PostAuthOptions
) {
  return baseApiRequest<T>(path, {
    method: 'POST',
    json: body,
    fallbackMessage,
    responseType,
    errorFactory: (message, status) => new AuthError(message, status),
  });
}

export { postAuth };
