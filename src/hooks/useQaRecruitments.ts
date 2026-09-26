import { useQuery } from '@tanstack/react-query';

import { getQaRecruitments } from '@/apis/qa';
import type { QaRecruitmentListParams } from '@/types/qa';

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

export { qaRecruitmentKeys, useQaRecruitments };
