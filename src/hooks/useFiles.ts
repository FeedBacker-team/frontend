import { useMutation } from '@tanstack/react-query';

import { deleteImage, uploadImage } from '@/apis/file';

const fileKeys = {
  all: ['files'] as const,
};

function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}

function useDeleteImage() {
  return useMutation({
    mutationFn: deleteImage,
  });
}

export { fileKeys, useDeleteImage, useUploadImage };
