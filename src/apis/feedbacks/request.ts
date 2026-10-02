import { apiRequest, type ApiRequestOptions } from '@/apis/client';

import { FeedbackError } from './error';

type FeedbackRequestOptions = Omit<ApiRequestOptions, 'errorFactory'>;

function feedbackRequest<T>(path: string, options: FeedbackRequestOptions) {
  return apiRequest<T>(path, {
    ...options,
    errorFactory: (message, status) => new FeedbackError(message, status),
  });
}

export { feedbackRequest };
