'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { FeedbackError } from '@/apis/feedbacks';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { toast } from '@/components/common/Sonner';
import { MyQaFeedbackRejectConfirmDialog } from '@/components/domain/mypage/feedback-review/MyQaFeedbackRejectConfirmDialog';
import { MyQaFeedbackReviewCompleteDialog } from '@/components/domain/mypage/feedback-review/MyQaFeedbackReviewCompleteDialog';
import {
  FEEDBACK_REJECT_DETAIL_MAX_LENGTH,
  FEEDBACK_REJECT_DETAIL_MIN_LENGTH,
  FEEDBACK_REJECT_REASONS,
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
} from '@/constants/mypage';
import { useFeedbackDetail, useRejectFeedback } from '@/hooks/useFeedback';
import {
  feedbackRejectSchema,
  type FeedbackRejectFormValues,
} from '@/lib/schemas/mypage';

type MyQaFeedbackRejectFormProps = {
  feedbackPostId: string;
  feedbackId: string;
};

function getFeedbackErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof FeedbackError ? error.message : fallbackMessage;
}

function MyQaFeedbackRejectFormLoading() {
  return (
    <div
      className="mx-auto flex max-w-220 animate-pulse flex-col gap-8"
      aria-label="피드백 정보 불러오는 중"
    >
      <div className="h-24 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
    </div>
  );
}

function MyQaFeedbackRejectForm({
  feedbackPostId,
  feedbackId,
}: MyQaFeedbackRejectFormProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const detailQuery = useFeedbackDetail(feedbackPostId, feedbackId);
  const { mutate: rejectFeedback, isPending: isRejecting } =
    useRejectFeedback(feedbackPostId, feedbackId);

  const detail = detailQuery.data;

  useEffect(() => {
    if (detail && detail.status !== 'PENDING_REVIEW') {
      router.replace(`/mypage/my-qa/${feedbackPostId}/feedback/${feedbackId}`);
    }
  }, [detail, feedbackPostId, feedbackId, router]);

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getFeedbackErrorMessage(detailQuery.error, '피드백 정보를 불러오지 못했습니다')
      );
    }
  }, [detailQuery.isError, detailQuery.error]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<FeedbackRejectFormValues>({
    resolver: zodResolver(feedbackRejectSchema),
    mode: 'onChange',
    defaultValues: { detailReason: '' },
  });

  const reason = useWatch({ control, name: 'reason' });
  const detailReason = useWatch({ control, name: 'detailReason' });

  if (detailQuery.isPending) {
    return <MyQaFeedbackRejectFormLoading />;
  }

  if (detailQuery.isError || !detail || detail.status !== 'PENDING_REVIEW') {
    return null;
  }

  const { id, reviewerNickname, status, submittedAt, responseDeadlineHoursLeft } =
    detail;

  const onSubmit = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmReject = () => {
    rejectFeedback(
      { rejectType: reason, rejectDetail: detailReason.trim() },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setIsCompleteOpen(true);
        },
        onError: (error) => {
          setIsConfirmOpen(false);
          toast.error(getFeedbackErrorMessage(error, '피드백 거절에 실패했습니다'));
        },
      }
    );
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
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
            value={reason ?? ''}
            onValueChange={(value) =>
              setValue(
                'reason',
                value as FeedbackRejectFormValues['reason'],
                { shouldValidate: true }
              )
            }
            size="medium"
            className="gap-4"
          >
            {FEEDBACK_REJECT_REASONS.map((item) => (
              <Radio key={item.value} value={item.value} label={item.label} />
            ))}
          </RadioGroup>
          {errors.reason?.message ? (
            <p role="alert" className="text-c1 text-rust-600">
              {errors.reason.message}
            </p>
          ) : null}
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-7">
          <h2 className="text-h3 text-text-default">
            상세 사유 <span className="text-rust-600">*</span>
          </h2>
          <Input
            size="large"
            placeholder="어떤 점이 부족했는지 구체적으로 작성해 주세요."
            aria-invalid={!!errors.detailReason}
            {...register('detailReason')}
          />
          <div className="flex items-center justify-between text-c1 text-text-sub">
            <p>최소 {FEEDBACK_REJECT_DETAIL_MIN_LENGTH}자 이상 작성해 주세요.</p>
            <p>
              {detailReason?.length ?? 0} / {FEEDBACK_REJECT_DETAIL_MAX_LENGTH}
              자
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
            disabled={!isValid || isRejecting}
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
