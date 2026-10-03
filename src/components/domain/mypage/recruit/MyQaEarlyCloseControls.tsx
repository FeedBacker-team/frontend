'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { MyQaFeedbackPendingReviewDialog } from '@/components/domain/mypage/feedback-review/MyQaFeedbackPendingReviewDialog';
import { QaEarlyCloseConfirmDialog } from '@/components/domain/qa/detail/QaEarlyCloseConfirmDialog';
import { REVIEW_FILTER_QUERY_KEY } from '@/constants/mypage';
import { useCompleteQaRecruitment } from '@/hooks/useQaRecruitments';
import type { QaRecruitmentStatus } from '@/types/qa';

type MyQaEarlyCloseControlsProps = {
  feedbackPostId: string;
  status: QaRecruitmentStatus;
  daysLeft: number | null;
  pendingReviewCount: number;
};

function MyQaEarlyCloseControls({
  feedbackPostId,
  status,
  daysLeft,
  pendingReviewCount,
}: MyQaEarlyCloseControlsProps) {
  const router = useRouter();
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const completeMutation = useCompleteQaRecruitment(feedbackPostId);

  const handleEarlyCloseClick = () => {
    if (pendingReviewCount > 0) {
      setIsPendingDialogOpen(true);
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="medium"
        disabled={daysLeft === null}
        onClick={handleEarlyCloseClick}
      >
        {status === 'RECRUITING' ? '조기 마감하기' : '종료된 QA입니다.'}
      </Button>
      <Button
        size="medium"
        disabled={status === 'RECRUITING'}
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

      <QaEarlyCloseConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!completeMutation.isPending) {
            setIsConfirmDialogOpen(open);
          }
        }}
        isPending={completeMutation.isPending}
        onConfirm={() => {
          completeMutation.mutate(undefined, {
            onSuccess: () => {
              setIsConfirmDialogOpen(false);
              toast.success('QA 모집을 조기 마감했습니다');
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'QA 모집 조기 마감에 실패했습니다'
              );
            },
          });
        }}
      />
    </>
  );
}

export { MyQaEarlyCloseControls };
export type { MyQaEarlyCloseControlsProps };
