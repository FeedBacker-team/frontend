import type { QaRecruitmentListParams } from '@/types/qa';

const qaRecruitmentKeys = {
  all: ['qa-recruitments'] as const,
  list: (params: QaRecruitmentListParams) =>
    [...qaRecruitmentKeys.all, 'list', params] as const,
  detail: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'detail', feedbackPostId] as const,
  feedbackForm: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'feedback-form', feedbackPostId] as const,
  feedbackReviews: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'feedback-reviews', feedbackPostId] as const,
  result: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'result', feedbackPostId] as const,
  mine: () => [...qaRecruitmentKeys.all, 'mine'] as const,
  myParticipations: () =>
    [...qaRecruitmentKeys.all, 'my-participations'] as const,
  rewardRanking: () =>
    [...qaRecruitmentKeys.all, 'reward-ranking'] as const,
};

export { qaRecruitmentKeys };
