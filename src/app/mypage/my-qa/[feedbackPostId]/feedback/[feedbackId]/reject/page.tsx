import type { Metadata } from 'next';

import { MyQaFeedbackRejectForm } from '@/components/domain/mypage/feedback-review/MyQaFeedbackRejectForm';

export const metadata: Metadata = {
  title: '거절 사유 작성',
};

export default async function MyQaFeedbackRejectPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/feedback/[feedbackId]/reject'>
) {
  const { feedbackPostId, feedbackId } = await props.params;

  return (
    <MyQaFeedbackRejectForm
      feedbackPostId={feedbackPostId}
      feedbackId={feedbackId}
    />
  );
}
