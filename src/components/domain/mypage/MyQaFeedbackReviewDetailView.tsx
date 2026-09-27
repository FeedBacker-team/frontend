'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { MyQaFeedbackQuestionView } from '@/components/domain/mypage/MyQaFeedbackQuestionView';
import { MyQaFeedbackReviewCompleteDialog } from '@/components/domain/mypage/MyQaFeedbackReviewCompleteDialog';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
} from '@/constants/mypage';
import type { MyQaFeedbackReviewDetail } from '@/types/mypage';

type MyQaFeedbackReviewDetailViewProps = {
  detail: MyQaFeedbackReviewDetail;
};

function MyQaFeedbackReviewDetailView({
  detail,
}: MyQaFeedbackReviewDetailViewProps) {
  const router = useRouter();
  const [isAcceptCompleteOpen, setIsAcceptCompleteOpen] = useState(false);

  const {
    id,
    feedbackPostId,
    reviewerNickname,
    status,
    submittedAt,
    responseDeadlineHoursLeft,
    contentType,
    reviewImages,
    feedbackQuestions,
  } = detail;

  const isPendingReview = status === 'PENDING_REVIEW';

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
          <div className="size-10 shrink-0 rounded-full bg-gray-200" />
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

        {contentType === '이미지형' && reviewImages && reviewImages.length > 0 && (
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
              onClick={() => {
                // TODO: PATCH /api/feedbacks/{feedbackId}/accept 연동. 아직 API가 없어 목업으로 수락 완료 처리만 한다.
                setIsAcceptCompleteOpen(true);
              }}
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
