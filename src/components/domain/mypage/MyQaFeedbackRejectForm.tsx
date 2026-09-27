'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { MyQaFeedbackRejectConfirmDialog } from '@/components/domain/mypage/MyQaFeedbackRejectConfirmDialog';
import { MyQaFeedbackReviewCompleteDialog } from '@/components/domain/mypage/MyQaFeedbackReviewCompleteDialog';
import {
  FEEDBACK_REJECT_DETAIL_MIN_LENGTH,
  FEEDBACK_REJECT_REASONS,
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
} from '@/constants/mypage';
import type {
  FeedbackRejectReasonValue,
  MyQaFeedbackReviewDetail,
} from '@/types/mypage';

type MyQaFeedbackRejectFormProps = {
  detail: MyQaFeedbackReviewDetail;
};

function MyQaFeedbackRejectForm({ detail }: MyQaFeedbackRejectFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState<FeedbackRejectReasonValue | ''>('');
  const [detailReason, setDetailReason] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const {
    id,
    feedbackPostId,
    reviewerNickname,
    status,
    submittedAt,
    responseDeadlineHoursLeft,
  } = detail;

  const canSubmit =
    reason !== '' &&
    detailReason.trim().length >= FEEDBACK_REJECT_DETAIL_MIN_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsConfirmOpen(true);
  };

  const handleConfirmReject = () => {
    // TODO: PATCH /api/feedbacks/{feedbackId}/reject 연동. 아직 API가 없어 목업으로 거절 완료 처리만 한다.
    setIsConfirmOpen(false);
    setIsCompleteOpen(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-220 flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-t2 text-text-default">거절 사유 작성</h1>
          <p className="text-b2 text-text-sub">
            작성하신 거절 사유는 테스터에게 그대로 전달되고, 테스터가 이의를
            제기할 수 있어요.
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

        <section className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-7">
          <h2 className="text-h3 text-text-default">
            거절 사유 <span className="text-rust-600">*</span>
          </h2>
          <RadioGroup
            value={reason}
            onValueChange={(value) =>
              setReason(value as FeedbackRejectReasonValue)
            }
            size="medium"
            className="gap-4"
          >
            {FEEDBACK_REJECT_REASONS.map((item) => (
              <Radio key={item.value} value={item.value} label={item.label} />
            ))}
          </RadioGroup>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-7">
          <h2 className="text-h3 text-text-default">
            상세 사유 <span className="text-rust-600">*</span>
          </h2>
          <Input
            size="large"
            placeholder="어떤 점이 부족했는지 구체적으로 작성해 주세요."
            value={detailReason}
            onChange={(event) => setDetailReason(event.target.value)}
          />
          <div className="flex items-center justify-between text-c1 text-text-sub">
            <p>최소 {FEEDBACK_REJECT_DETAIL_MIN_LENGTH}자 이상 작성해 주세요.</p>
            <p>
              {detailReason.length} / {FEEDBACK_REJECT_DETAIL_MIN_LENGTH}자
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={() =>
              router.push(`/mypage/my-qa/${feedbackPostId}/feedback/${id}`)
            }
          >
            다시 검토하기
          </Button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-rust-600 bg-white px-4 py-2.5 text-c1 font-bold text-rust-600 whitespace-nowrap outline-none transition-colors select-none hover:bg-rust-50 active:bg-rust-100 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
          >
            거절 사유 제출하기
          </button>
        </div>
      </form>

      <MyQaFeedbackRejectConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmReject}
      />
      <MyQaFeedbackReviewCompleteDialog
        open={isCompleteOpen}
        onOpenChange={setIsCompleteOpen}
        variant="REJECTED"
        feedbackPostId={feedbackPostId}
      />
    </>
  );
}

export { MyQaFeedbackRejectForm };
export type { MyQaFeedbackRejectFormProps };
