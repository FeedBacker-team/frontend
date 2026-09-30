type ApiErrorFactory = (message: string, status: number) => Error;

type BaseApiRequestOptions = RequestInit & {
  fallbackMessage: string | ((status: number) => string);
  errorFactory?: ApiErrorFactory;
  json?: unknown;
  responseType?: 'json' | 'void';
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error('API base URL is required');
  }

  return apiBaseUrl.replace(/\/+$/, '');
}

async function parseErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }
  } catch {
    // 에러 body가 JSON이 아닌 경우
  }

  return fallbackMessage;
}

async function baseApiRequest<T>(
  path: string,
  {
    fallbackMessage,
    errorFactory = (message, status) => new ApiError(message, status),
    json,
    responseType = 'json',
    ...init
  }: BaseApiRequestOptions
): Promise<T> {
  const headers = new Headers(init.headers);

  if (json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${getApiBaseUrl()}${normalizedPath}`, {
    ...init,
    headers,
    credentials: init.credentials ?? 'include',
    body: json === undefined ? init.body : JSON.stringify(json),
  });

  if (!response.ok) {
    const resolvedFallbackMessage =
      typeof fallbackMessage === 'function'
        ? fallbackMessage(response.status)
        : fallbackMessage;

    throw errorFactory(
      await parseErrorMessage(response, resolvedFallbackMessage),
      response.status
    );
  }

  if (responseType === 'void' || response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { ApiError, baseApiRequest };
export type { ApiErrorFactory, BaseApiRequestOptions };
