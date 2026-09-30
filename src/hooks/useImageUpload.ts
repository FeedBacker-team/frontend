import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { useUploadImages } from '@/hooks/useImages';
import { validateImageFile } from '@/lib/validateImageFile';

type UploadedImage = {
  image_path: string;
};

type UseImageUploadOptions = {
  onError?: (message: string) => void;
};

function getFileErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

function useImageUpload({ onError }: UseImageUploadOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const uploadedRef = useRef<UploadedImage | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const { mutate: uploadImageFiles, isPending: isUploading } =
    useUploadImages();

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
    uploadImageFiles([file], {
      onSuccess: ([imagePath]) => {
        const nextUploaded = {
          image_path: imagePath,
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
    clear();
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

    uploadSelectedImage(file);
  };

  return {
    inputRef,
    previewUrl,
    uploaded,
    isPending: isUploading,
    selectFile,
    remove,
  };
}

export { useImageUpload };
export type { UploadedImage, UseImageUploadOptions };
