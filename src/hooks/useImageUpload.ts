import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { validateImageFile } from '@/lib/validateImageFile';

type UseImageUploadOptions = {
  onError?: (message: string) => void;
};

function useImageUpload({ onError }: UseImageUploadOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clear = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setSelectedFile(null);
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

  const selectImage = (file: File) => {
    applyLocalPreview(file);
    setSelectedFile(file);
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

    selectImage(file);
  };

  return {
    inputRef,
    previewUrl,
    selectedFile,
    selectFile,
    remove,
  };
}

export { useImageUpload };
export type { UseImageUploadOptions };
