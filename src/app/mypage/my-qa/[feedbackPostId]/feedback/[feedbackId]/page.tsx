import type { Metadata } from 'next';

import { MyQaFeedbackReviewDetailView } from '@/components/domain/mypage/feedback-review/MyQaFeedbackReviewDetailView';

export const metadata: Metadata = {
  title: '제출된 피드백 확인하기',
};

export default async function MyQaFeedbackReviewDetailPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/feedback/[feedbackId]'>
) {
  const { feedbackPostId, feedbackId } = await props.params;

  return (
    <MyQaFeedbackReviewDetailView
      feedbackPostId={feedbackPostId}
      feedbackId={feedbackId}
    />
  );
}
