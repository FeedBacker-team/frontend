'use client';

import Image from 'next/image';
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
import { MyObjectionCompleteDialog } from '@/components/domain/mypage/objection/MyObjectionCompleteDialog';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  OBJECTION_DETAIL_MIN_LENGTH,
  OBJECTION_REASONS,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
} from '@/constants/mypage';
import {
  useFeedbackParticipationDetail,
  useSubmitObjection,
} from '@/hooks/useFeedback';
import {
  objectionSchema,
  type ObjectionFormValues,
} from '@/lib/schemas/mypage';

function getFeedbackErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof FeedbackError ? error.message : fallbackMessage;
}

type MyObjectionFormProps = {
  feedbackId: string;
};

function MyObjectionFormLoading() {
  return (
    <div
      className="mx-auto flex max-w-220 animate-pulse flex-col gap-8"
      aria-label="피드백 정보 불러오는 중"
    >
      <div className="h-40 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
    </div>
  );
}

function MyObjectionForm({ feedbackId }: MyObjectionFormProps) {
  const router = useRouter();
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const detailQuery = useFeedbackParticipationDetail(feedbackId);
  const { mutate: submitObjection, isPending: isSubmitting } =
    useSubmitObjection(feedbackId);

  const detail = detailQuery.data;

  useEffect(() => {
    if (detail && detail.status !== 'REJECTED') {
      router.replace('/mypage?tab=QA_PARTICIPATION');
    }
  }, [detail, router]);

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
  } = useForm<ObjectionFormValues>({
    resolver: zodResolver(objectionSchema),
    mode: 'onChange',
    defaultValues: { detailReason: '' },
  });

  const reason = useWatch({ control, name: 'reason' });
  const detailReason = useWatch({ control, name: 'detailReason' });

  if (detailQuery.isPending) {
    return <MyObjectionFormLoading />;
  }

  if (detailQuery.isError || !detail || detail.status !== 'REJECTED') {
    return null;
  }

  const {
    title,
    status,
    startDate,
    endDate,
    contentType,
    daysLeft,
    rewardAcorn,
    participatedAt,
    submittedAt,
    rejectReason,
  } = detail;

  const onSubmit = (values: ObjectionFormValues) => {
    submitObjection(
      { reason: values.reason, detailReason: values.detailReason.trim() },
      {
        onSuccess: () => setIsCompleteOpen(true),
        onError: (error) =>
          toast.error(
            getFeedbackErrorMessage(error, '이의제기 접수에 실패했습니다')
          ),
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
          <h1 className="text-t2 text-text-default">이의제기 접수</h1>
          <p className="text-b2 text-text-sub">
            제출하신 이의제기는 운영팀에서 피드백 내용과 거절 사유를 신중히
            검토한 뒤 결과를 안내해 드려요.
          </p>
        </div>

        <section className="flex flex-col gap-6 rounded-2xl border border-gray-300 bg-white p-7">
          <div className="flex items-center gap-4">
            <div className="size-17 shrink-0 rounded-lg bg-gray-200" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Badge
                variant={MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT[status]}
                className="self-start"
              >
                {MY_QA_PARTICIPATION_STATUS_LABEL[status]}
              </Badge>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-h3 truncate text-text-default">
                    {title}
                  </h2>
                  {startDate || endDate ? (
                    <p className="text-c1 text-text-info">
                      {startDate} ~ {endDate}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge>{contentType}</Badge>
                  {daysLeft !== null ? (
                    <Badge
                      variant={
                        daysLeft <= QA_URGENT_DAYS_LEFT_THRESHOLD
                          ? 'rust'
                          : 'green'
                      }
                    >
                      D-{daysLeft}
                    </Badge>
                  ) : endDate ? (
                    <Badge>{endDate} 종료</Badge>
                  ) : null}
                  <Badge
                    variant="yellow"
                    icon={
                      <Image
                        src="/images/acorn.svg"
                        alt="도토리"
                        aria-hidden
                        width={17}
                        height={17}
                        unoptimized
                      />
                    }
                  >
                    {rewardAcorn}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-5">
              <p className="text-c1 text-text-sub">QA 참여 일시</p>
              <p className="text-h4 text-text-default">{participatedAt}</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-5">
              <p className="text-c1 text-text-sub">피드백 제출 일시</p>
              <p className="text-h4 text-text-default">{submittedAt}</p>
            </div>
          </div>
        </section>

        {rejectReason && (
          <div className="flex flex-col gap-3">
            <h3 className="text-h4 text-text-default">거절 사유</h3>
            <div className="flex flex-col gap-1 rounded-lg border border-rust-600 bg-rust-50 p-4">
              <p className="text-b2 font-bold text-text-default">
                {rejectReason.title}
              </p>
              <p className="text-b2 text-text-sub whitespace-pre-wrap">
                {rejectReason.description}
              </p>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-7">
          <h2 className="text-h3 text-text-default">
            이의제기 사유 <span className="text-rust-600">*</span>
          </h2>
          <RadioGroup
            value={reason ?? ''}
            onValueChange={(value) =>
              setValue('reason', value as ObjectionFormValues['reason'], {
                shouldValidate: true,
              })
            }
            size="medium"
            className="gap-4"
          >
            {OBJECTION_REASONS.map((item) => (
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
            placeholder="어떤 점이 부당하게 거절되었는지 구체적으로 작성해 주세요."
            aria-invalid={!!errors.detailReason}
            {...register('detailReason')}
          />
          <div className="flex items-center justify-between text-c1 text-text-sub">
            <p>최소 {OBJECTION_DETAIL_MIN_LENGTH}자 이상 작성해 주세요.</p>
            <p>
              {detailReason?.length ?? 0} / {OBJECTION_DETAIL_MIN_LENGTH}자
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={() => router.push('/mypage?tab=QA_PARTICIPATION')}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="medium"
            disabled={!isValid || isSubmitting}
          >
            이의제기 접수하기
          </Button>
        </div>
      </form>

      <MyObjectionCompleteDialog
        open={isCompleteOpen}
        onOpenChange={setIsCompleteOpen}
      />
    </>
  );
}

export { MyObjectionForm };
export type { MyObjectionFormProps };
