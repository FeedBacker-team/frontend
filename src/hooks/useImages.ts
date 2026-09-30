import { useMutation } from '@tanstack/react-query';

import { uploadImages } from '@/apis/images';

function useUploadImages() {
  return useMutation({
    mutationFn: uploadImages,
  });
}

export { useUploadImages };
