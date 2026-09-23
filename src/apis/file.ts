import {
  FileError,
  type FileErrorCode,
  type FileErrorResponse,
  type UploadImageResponse,
} from '@/types/file';

const FILE_PATHS = {
  upload: '/api/files',
  delete: (fileId: number) => `/api/files/${fileId}`,
} as const;

const FILE_ERROR_MESSAGE: Record<FileErrorCode, string> = {
  FILE_REQUIRED: '이미지를 선택해 주세요',
  UNSUPPORTED_IMAGE_TYPE: 'PNG, JPG 형식의 이미지만 등록할 수 있어요.',
  FILE_SIZE_EXCEEDED: '이미지는 파일당 최대 5MB까지 등록할 수 있어요.',
  FILE_UPLOAD_FAILED: '이미지 업로드에 실패했습니다',
  UNAUTHORIZED: '로그인이 필요해요',
  FILE_NOT_FOUND: '이미지를 찾을 수 없습니다',
  FILE_ALREADY_IN_USE: '사용 중인 이미지는 삭제할 수 없습니다',
  FILE_DELETE_FAILED: '이미지 삭제에 실패했습니다',
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFileErrorCode(value: unknown): value is FileErrorCode {
  return typeof value === 'string' && value in FILE_ERROR_MESSAGE;
}

function getMockUploadResponse(file: File): UploadImageResponse {
  return {
    file_id: Date.now(),
    original_file_name: file.name,
    content_type: file.type,
    file_size: file.size,
    image_url: URL.createObjectURL(file),
    status: 'TEMP',
    created_at: new Date().toISOString(),
  };
}

async function parseFileError(response: Response, fallbackMessage: string) {
  try {
    const data: unknown = await response.json();

    if (typeof data !== 'object' || data === null) {
      return { message: fallbackMessage };
    }

    const error = data as FileErrorResponse;
    const code = isFileErrorCode(error.code) ? error.code : undefined;
    const message =
      (typeof error.message === 'string' && error.message) ||
      (code ? FILE_ERROR_MESSAGE[code] : fallbackMessage);

    return { message, code };
  } catch {
    return { message: fallbackMessage };
  }
}

async function requestFile(
  path: string,
  init: RequestInit,
  fallbackMessage: string
) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error('API base URL is required');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await parseFileError(response, fallbackMessage);
    throw new FileError(error.message, response.status, error.code);
  }

  return response;
}

async function uploadImage(file: File): Promise<UploadImageResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return getMockUploadResponse(file);
  }

  const body = new FormData();
  body.append('file', file);

  const response = await requestFile(
    FILE_PATHS.upload,
    { method: 'POST', body },
    '이미지 업로드에 실패했습니다'
  );

  return response.json();
}

async function deleteImage(fileId: number): Promise<void> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return;
  }

  await requestFile(
    FILE_PATHS.delete(fileId),
    { method: 'DELETE' },
    '이미지 삭제에 실패했습니다'
  );
}

export { deleteImage, uploadImage };
