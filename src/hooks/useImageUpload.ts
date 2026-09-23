import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { useDeleteImage, useUploadImage } from '@/hooks/useFiles';
import { validateImageFile } from '@/lib/validateImageFile';
import { FileError } from '@/types/file';

type UploadedImage = {
  file_id: number;
  image_url: string;
};

type UseImageUploadOptions = {
  onError?: (message: string) => void;
};

function getFileErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof FileError ? error.message : fallbackMessage;
}

function useImageUpload({ onError }: UseImageUploadOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const uploadedRef = useRef<UploadedImage | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const { mutate: uploadImageFile, isPending: isUploading } = useUploadImage();
  const { mutate: deleteImageFile, isPending: isDeleting } = useDeleteImage();

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const reportError = (error: unknown, fallbackMessage: string) => {
    onError?.(getFileErrorMessage(error, fallbackMessage));
  };

  const clear = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    uploadedRef.current = null;
    setUploaded(null);
    setPreviewUrl(null);
  };

  const applyLocalPreview = (file: File) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
  };

  const uploadSelectedImage = (file: File) => {
    applyLocalPreview(file);
    uploadImageFile(file, {
      onSuccess: (data) => {
        const nextUploaded = {
          file_id: data.file_id,
          image_url: data.image_url,
        };
        uploadedRef.current = nextUploaded;
        setUploaded(nextUploaded);
      },
      onError: (error) => {
        reportError(error, '이미지 업로드에 실패했습니다');
        clear();
      },
    });
  };

  const remove = () => {
    const current = uploadedRef.current;

    if (!current) {
      clear();
      return;
    }

    deleteImageFile(current.file_id, {
      onSuccess: () => {
        clear();
      },
      onError: (error) => {
        reportError(error, '이미지 삭제에 실패했습니다');
      },
    });
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      event.target.value = '';
      return;
    }

    const result = validateImageFile(file);
    if (!result.ok) {
      onError?.(result.message);
      event.target.value = '';
      return;
    }

    const previousFileId = uploadedRef.current?.file_id;

    if (!previousFileId) {
      uploadSelectedImage(file);
      return;
    }

    deleteImageFile(previousFileId, {
      onSuccess: () => {
        uploadedRef.current = null;
        setUploaded(null);
        uploadSelectedImage(file);
      },
      onError: (error) => {
        reportError(error, '이미지 삭제에 실패했습니다');
        event.target.value = '';
      },
    });
  };

  return {
    inputRef,
    previewUrl,
    uploaded,
    isPending: isUploading || isDeleting,
    selectFile,
    remove,
  };
}

export { useImageUpload };
export type { UploadedImage, UseImageUploadOptions };
