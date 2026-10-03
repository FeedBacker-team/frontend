import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/constants/file';

const IMAGE_TYPE_ERROR = 'PNG, JPG 형식의 이미지만 등록할 수 있어요.';
const IMAGE_SIZE_ERROR = '이미지는 파일당 최대 5MB까지 등록할 수 있어요.';

type ImageFileValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function validateImageFile(file: File): ImageFileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, message: IMAGE_TYPE_ERROR };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { ok: false, message: IMAGE_SIZE_ERROR };
  }

  return { ok: true };
}

function validateImageFiles(
  files: File[],
  maxCount: number
): ImageFileValidationResult {
  if (files.length > maxCount) {
    return {
      ok: false,
      message: `이미지는 최대 ${maxCount}개까지 등록할 수 있어요.`,
    };
  }

  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.ok) {
      return result;
    }
  }

  return { ok: true };
}

export { validateImageFile, validateImageFiles };
export type { ImageFileValidationResult };
