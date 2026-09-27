'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { MyQaFeedbackPendingReviewDialog } from '@/components/domain/mypage/MyQaFeedbackPendingReviewDialog';
import { REVIEW_FILTER_QUERY_KEY } from '@/constants/mypage';

type MyQaEarlyCloseControlsProps = {
  feedbackPostId: string;
  daysLeft: number | null;
  pendingReviewCount: number;
};

function MyQaEarlyCloseControls({
  feedbackPostId,
  daysLeft,
  pendingReviewCount,
}: MyQaEarlyCloseControlsProps) {
  const router = useRouter();
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);

  const handleEarlyCloseClick = () => {
    if (pendingReviewCount > 0) {
      setIsPendingDialogOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="medium"
        disabled={daysLeft === null}
        onClick={handleEarlyCloseClick}
      >
        조기 마감하기
      </Button>
      <Button
        size="medium"
        disabled={daysLeft !== null}
        onClick={() => router.push(`/mypage/my-qa/${feedbackPostId}/result`)}
      >
        QA 결과 확인하기
      </Button>

      <MyQaFeedbackPendingReviewDialog
        open={isPendingDialogOpen}
        onOpenChange={setIsPendingDialogOpen}
        pendingCount={pendingReviewCount}
        onReview={() => {
          setIsPendingDialogOpen(false);
          router.push(
            `/mypage/my-qa/${feedbackPostId}?${REVIEW_FILTER_QUERY_KEY}=PENDING_REVIEW`
          );
        }}
      />
    </>
  );
}

export { MyQaEarlyCloseControls };
export type { MyQaEarlyCloseControlsProps };
