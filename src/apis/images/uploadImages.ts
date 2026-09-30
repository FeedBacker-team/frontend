import { ApiError, apiRequest } from '@/apis/client';

const IMAGE_UPLOAD_PATH = '/api/images';

type UploadImagesResponse = string[];

function getMockImagePaths(files: File[]): UploadImagesResponse {
  const timestamp = Date.now();

  return files.map((file, index) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    return `images/mock-${timestamp}-${index}.${extension}`;
  });
}

async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockImagePaths(files);
  }

  const body = new FormData();
  files.forEach((file) => body.append('images', file));

  const data = await apiRequest<unknown>(IMAGE_UPLOAD_PATH, {
    method: 'POST',
    body,
    fallbackMessage: '이미지 업로드에 실패했습니다',
  });

  if (
    !Array.isArray(data) ||
    data.length !== files.length ||
    !data.every((path) => typeof path === 'string' && path.length > 0)
  ) {
    throw new ApiError('이미지 업로드 응답 형식이 올바르지 않습니다', 500);
  }

  return data;
}

export { uploadImages };
export type { UploadImagesResponse };
