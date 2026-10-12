import { apiRequest, type ApiRequestOptions } from '@/apis/client';
import { QaApiError } from '@/types/qa';

type QaRequestOptions = Omit<ApiRequestOptions, 'errorFactory'>;

function qaRequest<T>(path: string, options: QaRequestOptions) {
  return apiRequest<T>(path, {
    ...options,
    errorFactory: (message, status) => new QaApiError(message, status),
  });
}

export { qaRequest };
