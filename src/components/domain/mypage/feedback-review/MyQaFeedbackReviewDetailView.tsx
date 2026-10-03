'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FeedbackError } from '@/apis/feedbacks';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { MyQaFeedbackQuestionView } from '@/components/domain/mypage/feedback-review/MyQaFeedbackQuestionView';
import { MyQaFeedbackReviewCompleteDialog } from '@/components/domain/mypage/feedback-review/MyQaFeedbackReviewCompleteDialog';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
} from '@/constants/mypage';
import { useAcceptFeedback, useFeedbackDetail } from '@/hooks/useFeedback';

type MyQaFeedbackReviewDetailViewProps = {
  feedbackPostId: string;
  feedbackId: string;
};

function getFeedbackErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof FeedbackError ? error.message : fallbackMessage;
}

function MyQaFeedbackReviewDetailLoading() {
  return (
    <div
      className="mx-auto flex max-w-220 animate-pulse flex-col gap-8"
      aria-label="제출된 피드백 불러오는 중"
    >
      <div className="h-24 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
      <div className="h-60 rounded-2xl bg-gray-100" />
    </div>
  );
}

type MyQaFeedbackReviewDetailErrorProps = {
  message: string;
  onRetry: () => void;
};

function MyQaFeedbackReviewDetailError({
  message,
  onRetry,
}: MyQaFeedbackReviewDetailErrorProps) {
  return (
    <section className="mx-auto flex max-w-220 min-h-100 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-text-default">
          피드백 정보를 불러오지 못했습니다
        </h1>
        <p className="text-b2 text-text-sub">{message}</p>
      </div>
      <Button size="medium" onClick={onRetry}>
        다시 시도
      </Button>
    </section>
  );
}

function MyQaFeedbackReviewDetailView({
  feedbackPostId,
  feedbackId,
}: MyQaFeedbackReviewDetailViewProps) {
  const router = useRouter();
  const [isAcceptCompleteOpen, setIsAcceptCompleteOpen] = useState(false);
  const detailQuery = useFeedbackDetail(feedbackPostId, feedbackId);
  const { mutate: acceptFeedback, isPending: isAccepting } = useAcceptFeedback(
    feedbackPostId,
    feedbackId
  );

  if (detailQuery.isPending) {
    return <MyQaFeedbackReviewDetailLoading />;
  }

  if (detailQuery.isError) {
    return (
      <MyQaFeedbackReviewDetailError
        message={getFeedbackErrorMessage(
          detailQuery.error,
          '잠시 후 다시 시도해 주세요.'
        )}
        onRetry={() => void detailQuery.refetch()}
      />
    );
  }

  const detail = detailQuery.data;

  if (!detail) {
    return null;
  }

  const {
    id,
    reviewerNickname,
    reviewerProfileImageUrl,
    status,
    submittedAt,
    responseDeadlineHoursLeft,
    contentType,
    reviewImages,
    feedbackQuestions,
  } = detail;

  const isPendingReview = status === 'PENDING_REVIEW';

  const handleAccept = () => {
    acceptFeedback(undefined, {
      onSuccess: () => setIsAcceptCompleteOpen(true),
      onError: (error) =>
        toast.error(
          getFeedbackErrorMessage(error, '피드백 수락에 실패했습니다')
        ),
    });
  };

  return (
    <>
      <div className="mx-auto flex max-w-220 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-t2 text-text-default">제출된 피드백 확인하기</h1>
          <p className="text-b2 text-text-sub">
            테스터가 제출한 답변을 꼼꼼히 검토한 후, 수락 여부를 결정해 주세요.
          </p>
        </div>

        <section className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white p-7">
          <Image
            src={reviewerProfileImageUrl ?? '/icons/basic-avatars.svg'}
            alt=""
            aria-hidden
            width={40}
            height={40}
            unoptimized
            className="size-10 shrink-0 rounded-full object-cover bg-gray-200"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-b1 text-text-default">{reviewerNickname}</p>
              <Badge variant={MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT[status]}>
                {MY_QA_PARTICIPATION_STATUS_LABEL[status]}
              </Badge>
            </div>
            <p className="text-c1 text-text-sub">
              {submittedAt} 제출
              {responseDeadlineHoursLeft != null && (
                <> | 응답 기한 {responseDeadlineHoursLeft}시간 남음</>
              )}
            </p>
          </div>
        </section>

        {contentType === '이미지형' &&
          reviewImages &&
          reviewImages.length > 0 && (
            <section className="flex flex-col gap-6 rounded-2xl border border-gray-300 bg-white p-7">
              <div className="flex gap-6">
                {reviewImages.map((image, index) => (
                  <div key={image} className="flex flex-col items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-c1 text-text-sub">
                      {index + 1}
                    </span>
                    <div className="size-45 shrink-0 rounded-lg bg-gray-200" />
                  </div>
                ))}
              </div>
            </section>
          )}

        {feedbackQuestions.map((question) => (
          <section
            key={question.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-7"
          >
            <MyQaFeedbackQuestionView question={question} />
          </section>
        ))}

        {isPendingReview && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="medium"
              onClick={() =>
                router.push(
                  `/mypage/my-qa/${feedbackPostId}/feedback/${id}/reject`
                )
              }
            >
              거절하기
            </Button>
            <Button
              variant="primary"
              size="medium"
              disabled={isAccepting}
              onClick={handleAccept}
            >
              수락하기
            </Button>
          </div>
        )}
      </div>

      <MyQaFeedbackReviewCompleteDialog
        open={isAcceptCompleteOpen}
        onOpenChange={setIsAcceptCompleteOpen}
        variant="ACCEPTED"
        feedbackPostId={feedbackPostId}
      />
    </>
  );
}

export { MyQaFeedbackReviewDetailView };
export type { MyQaFeedbackReviewDetailViewProps };
