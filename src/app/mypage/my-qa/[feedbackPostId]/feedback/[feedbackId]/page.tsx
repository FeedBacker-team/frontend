import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MyQaFeedbackReviewDetailView } from '@/components/domain/mypage/MyQaFeedbackReviewDetailView';
import { getMyQaFeedbackReviewDetailById } from '@/constants/mypage';

export const metadata: Metadata = {
  title: '제출된 피드백 확인하기',
};

export default async function MyQaFeedbackReviewDetailPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/feedback/[feedbackId]'>
) {
  const { feedbackPostId, feedbackId } = await props.params;
  const detail = getMyQaFeedbackReviewDetailById(feedbackPostId, feedbackId);

  if (!detail) {
    notFound();
  }

  return <MyQaFeedbackReviewDetailView detail={detail} />;
}
