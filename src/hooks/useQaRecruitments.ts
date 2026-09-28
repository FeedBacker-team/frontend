import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { uploadQaImages } from '@/apis/file';
import { createQaRecruitment, getQaRecruitments } from '@/apis/qa';
import { buildQaRecruitmentRequest } from '@/lib/qaRecruit';
import type {
  QaRecruitFormValues,
  QaRecruitmentListParams,
} from '@/types/qa';

const qaRecruitmentKeys = {
  all: ['qa-recruitments'] as const,
  list: (params: QaRecruitmentListParams) =>
    [...qaRecruitmentKeys.all, 'list', params] as const,
};

function useQaRecruitments(params: QaRecruitmentListParams = {}) {
  return useQuery({
    queryKey: qaRecruitmentKeys.list(params),
    queryFn: ({ signal }) => getQaRecruitments(params, signal),
  });
}

async function submitQaRecruitment(values: QaRecruitFormValues) {
  const uploadedPaths =
    values.target === 'IMAGE'
      ? await uploadQaImages(values.testImages)
      : [];
  const request = buildQaRecruitmentRequest(values, uploadedPaths);

  return createQaRecruitment(request);
}

function useCreateQaRecruitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQaRecruitment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qaRecruitmentKeys.all }),
  });
}

export {
  qaRecruitmentKeys,
  useCreateQaRecruitment,
  useQaRecruitments,
};
