import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MyQaFeedbackRejectForm } from '@/components/domain/mypage/MyQaFeedbackRejectForm';
import { getMyQaFeedbackReviewDetailById } from '@/constants/mypage';

export const metadata: Metadata = {
  title: '거절 사유 작성',
};

export default async function MyQaFeedbackRejectPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/feedback/[feedbackId]/reject'>
) {
  const { feedbackPostId, feedbackId } = await props.params;
  const detail = getMyQaFeedbackReviewDetailById(feedbackPostId, feedbackId);

  if (!detail || detail.status !== 'PENDING_REVIEW') {
    notFound();
  }

  return <MyQaFeedbackRejectForm detail={detail} />;
}
