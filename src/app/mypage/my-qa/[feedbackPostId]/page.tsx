import type { Metadata } from 'next';

import { MyQaRecruitDetailView } from '@/components/domain/mypage/MyQaRecruitDetailView';
import {
  isMyQaFeedbackReviewFilter,
  REVIEW_FILTER_QUERY_KEY,
} from '@/constants/mypage';

export const metadata: Metadata = {
  title: 'QA 진행 상황',
};

export default async function MyQaRecruitDetailPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]'>
) {
  const { feedbackPostId } = await props.params;
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams[REVIEW_FILTER_QUERY_KEY])
    ? searchParams[REVIEW_FILTER_QUERY_KEY][0]
    : searchParams[REVIEW_FILTER_QUERY_KEY];

  return (
    <MyQaRecruitDetailView
      feedbackPostId={feedbackPostId}
      initialFilter={
        isMyQaFeedbackReviewFilter(filterParam) ? filterParam : undefined
      }
    />
  );
}
