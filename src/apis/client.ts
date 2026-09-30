import {
  ApiError,
  baseApiRequest,
  type BaseApiRequestOptions,
} from '@/apis/baseClient';
import { tokenManager } from '@/lib/auth/tokenManager';
import { refreshAuthSession } from '@/lib/auth/refreshSession';

type ApiRequestOptions = BaseApiRequestOptions & {
  authenticated?: boolean;
  retryOnUnauthorized?: boolean;
};

async function apiRequest<T>(
  path: string,
  {
    authenticated = true,
    retryOnUnauthorized = true,
    ...options
  }: ApiRequestOptions
): Promise<T> {
  const request = () => {
    const headers = new Headers(options.headers);
    const tokenVersion = authenticated
      ? tokenManager.applyTo(headers)
      : undefined;

    return {
      promise: baseApiRequest<T>(path, { ...options, headers }),
      tokenVersion,
    };
  };

  const initialRequest = request();

  try {
    return await initialRequest.promise;
  } catch (error) {
    const shouldRefresh =
      authenticated &&
      retryOnUnauthorized &&
      error instanceof ApiError &&
      error.status === 401;

    if (!shouldRefresh) {
      throw error;
    }

    if (
      initialRequest.tokenVersion !== undefined &&
      tokenManager.hasChangedSince(initialRequest.tokenVersion)
    ) {
      return request().promise;
    }

    try {
      await refreshAuthSession();
    } catch {
      throw error;
    }

    return request().promise;
  }
}

export { ApiError, apiRequest };
export type { ApiRequestOptions };
