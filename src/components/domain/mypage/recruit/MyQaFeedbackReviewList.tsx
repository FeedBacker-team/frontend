'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/common/Badge';
import { buttonVariants } from '@/components/common/Button';
import { ToastLarge } from '@/components/common/ToastLarge';
import {
  MY_QA_FEEDBACK_REVIEW_FILTER_LABEL,
  MY_QA_FEEDBACK_REVIEW_FILTER_ORDER,
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  REVIEW_FILTER_QUERY_KEY,
} from '@/constants/mypage';
import { cn } from '@/lib/utils';
import type {
  MyQaFeedbackReviewFilter,
  MyQaFeedbackReviewItem,
} from '@/types/mypage';

type MyQaFeedbackReviewListProps = {
  feedbackPostId: string;
  reviews: MyQaFeedbackReviewItem[];
  initialFilter?: MyQaFeedbackReviewFilter;
};

function MyQaFeedbackReviewList({
  feedbackPostId,
  reviews,
  initialFilter,
}: MyQaFeedbackReviewListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<MyQaFeedbackReviewFilter>(
    initialFilter ?? 'ALL'
  );
  const pendingCount = reviews.filter(
    (review) => review.status === 'PENDING_REVIEW'
  ).length;
  const [isToastOpen, setIsToastOpen] = useState(pendingCount > 0);

  const handleFilterChange = (next: MyQaFeedbackReviewFilter) => {
    setFilter(next);
    router.replace(`${pathname}?${REVIEW_FILTER_QUERY_KEY}=${next}`, {
      scroll: false,
    });
  };

  const countByFilter: Record<MyQaFeedbackReviewFilter, number> = {
    ALL: reviews.length,
    PENDING_REVIEW: pendingCount,
    ACCEPTED: reviews.filter((review) => review.status === 'ACCEPTED').length,
    REJECTED: reviews.filter((review) => review.status === 'REJECTED').length,
  };

  const filteredReviews =
    filter === 'ALL'
      ? reviews
      : reviews.filter((review) => review.status === filter);

  return (
    <>
      <section className="flex flex-col gap-6 rounded-2xl border border-gray-300 bg-white p-7">
        <h2 className="text-h3 text-text-default">제출된 피드백</h2>

        <div
          role="tablist"
          aria-label="제출된 피드백 필터"
          className="flex gap-10 border-b border-gray-300"
        >
          {MY_QA_FEEDBACK_REVIEW_FILTER_ORDER.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              onClick={() => handleFilterChange(item)}
              className={cn(
                'cursor-pointer pb-4 text-h4 transition-colors',
                filter === item
                  ? 'border-b-2 border-rust-600 text-rust-600'
                  : 'text-text-disabled'
              )}
            >
              {MY_QA_FEEDBACK_REVIEW_FILTER_LABEL[item]} {countByFilter[item]}
            </button>
          ))}
        </div>

        <ul className="flex flex-col divide-y divide-gray-300">
          {filteredReviews.map((review) => (
            <li
              key={review.id}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 shrink-0 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-b1 text-text-default">
                      {review.reviewerNickname}
                    </p>
                    <Badge
                      variant={
                        MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT[
                          review.status
                        ]
                      }
                    >
                      {MY_QA_PARTICIPATION_STATUS_LABEL[review.status]}
                    </Badge>
                  </div>
                  <p className="text-c1 text-text-sub">
                    {review.submittedAt} 제출
                    {review.responseDeadlineHoursLeft != null && (
                      <> | 응답 기한 {review.responseDeadlineHoursLeft}시간 남음</>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href={`/mypage/my-qa/${feedbackPostId}/feedback/${review.id}`}
                className={cn(
                  buttonVariants({
                    variant:
                      review.status === 'PENDING_REVIEW' ? 'primary' : 'outline',
                    size: 'small',
                  })
                )}
              >
                피드백 보기
                <span
                  aria-hidden
                  className="size-4 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {isToastOpen && (
        <ToastLarge
          variant="notice"
          title={`새로운 피드백 ${pendingCount}건이 도착했어요!`}
          description="제출된 피드백은 72시간 내에 수락 여부를 결정해 주세요."
          onClose={() => setIsToastOpen(false)}
        />
      )}
    </>
  );
}

export { MyQaFeedbackReviewList };
export type { MyQaFeedbackReviewListProps };
