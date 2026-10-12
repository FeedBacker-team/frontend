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
  pendingReviewCount: number;
  recruitedCount: number;
  completedCount: number;
};

function MyQaEarlyCloseControls({
  feedbackPostId,
  status,
  pendingReviewCount,
  recruitedCount,
  completedCount,
}: MyQaEarlyCloseControlsProps) {
  const router = useRouter();
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const completeMutation = useCompleteQaRecruitment(feedbackPostId);

  const isRecruiting = status === 'RECRUITING';
  const isClosed = status === 'CLOSED';
  const hasPendingReview = pendingReviewCount > 0;
  // 모집 중이면 언제든 조기 마감할 수 있고, 모집이 종료(CLOSED)된 뒤에는
  // 아직 리뷰하지 않은 피드백이 남아있지 않을 때만 완료 처리로 넘어갈 수 있다.
  // 그렇지 않으면 모집 종료 후 completed API를 호출할 방법이 영영 없어진다.
  const canComplete = isRecruiting || (isClosed && !hasPendingReview);
  // 모집 인원이 다 차면 status가 RECRUITING에서 바뀌지만, 그렇다고 참여자들이
  // 피드백까지 다 제출했다는 뜻은 아니므로 완료 문구는 따로 구분해서 보여준다.
  const isFeedbackAllSubmitted = completedCount >= recruitedCount;

  const earlyCloseButtonLabel = (() => {
    if (isRecruiting) {
      return '조기 마감하기';
    }
    if (isClosed) {
      return hasPendingReview ? '검토할 피드백이 있어요' : '완료 처리하기';
    }
    return isFeedbackAllSubmitted ? '종료된 QA입니다.' : '모집이 마감되었습니다.';
  })();

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
        disabled={!canComplete}
        onClick={handleEarlyCloseClick}
      >
        {earlyCloseButtonLabel}
      </Button>
      <Button
        size="medium"
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
        mode={isClosed ? 'complete' : 'earlyClose'}
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
              toast.success(
                isClosed ? 'QA를 완료 처리했습니다' : 'QA 모집을 조기 마감했습니다'
              );
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'QA 처리에 실패했습니다'
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
