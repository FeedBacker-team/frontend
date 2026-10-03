'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/common/Badge';
import { Dialog, DialogContent } from '@/components/common/Dialog';
import { MyQaFeedbackQuestionView } from '@/components/domain/mypage/feedback-review/MyQaFeedbackQuestionView';
import { MyQaObjectionStatusSection } from '@/components/domain/mypage/objection/MyQaObjectionStatusSection';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  OBJECTION_REASONS,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
} from '@/constants/mypage';
import type { MyQaParticipationDetail } from '@/types/mypage';

type MyQaParticipationDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: MyQaParticipationDetail | null | undefined;
  isLoading?: boolean;
};

function MyQaParticipationDetailDialog({
  open,
  onOpenChange,
  detail,
  isLoading = false,
}: MyQaParticipationDetailDialogProps) {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-275 max-w-[calc(100vw-2rem)]">
          <div
            className="flex h-100 animate-pulse flex-col gap-4"
            aria-label="피드백 정보 불러오는 중"
          >
            <div className="h-20 rounded-lg bg-gray-100" />
            <div className="h-20 rounded-lg bg-gray-100" />
            <div className="h-40 rounded-lg bg-gray-100" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!detail) {
    return null;
  }

  const {
    id,
    title,
    status,
    startDate,
    endDate,
    contentType,
    daysLeft,
    rewardAcorn,
    participatedAt,
    submittedAt,
    feedbackQuestions,
    rejectReason,
    objection,
  } = detail;

  const objectionReasonLabel = objection
    ? OBJECTION_REASONS.find((item) => item.value === objection.reason)?.label
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative max-h-[min(76.875rem,calc(100vh-2rem))] w-275 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-xl pt-6 pb-9">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-10 flex size-5 cursor-pointer items-center justify-center"
        >
          <Image
            src="/icons/x.svg"
            alt="닫기 버튼"
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
        </button>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-6">
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
                    <Badge variant="green">{endDate} 종료</Badge>
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

          {objection && (
            <MyQaObjectionStatusSection status={status} objection={objection} />
          )}

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

              {!objection && (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 p-4">
                  <div className="flex items-start gap-2">
                    <Image
                      src="/icons/alert-circle.svg"
                      alt="경고"
                      aria-hidden
                      width={20}
                      height={20}
                      unoptimized
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-b2 text-text-default">
                        거절이 부당하다고 생각되면 이의를 제기할 수 있어요.
                      </p>
                      <p className="text-c1 text-text-sub">
                        이의 제기가 접수되면 운영팀이 확인 후 결과를 알려드려요.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/mypage/objection/${id}`}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-c1 text-text-default hover:bg-gray-100"
                  >
                    이의제기
                    <Image
                      src="/icons/chevron-right.svg"
                      alt="이의제기 페이지로 이동"
                      aria-hidden
                      width={16}
                      height={16}
                      unoptimized
                    />
                  </Link>
                </div>
              )}
            </div>
          )}

          {objection && (
            <div className="flex flex-col gap-3">
              <h3 className="text-h4 text-text-default">이의제기 내용</h3>
              <div className="flex flex-col gap-1 rounded-lg border border-gray-300 p-4">
                <p className="text-b2 font-bold text-text-default">
                  {objectionReasonLabel}
                </p>
                <p className="text-b2 text-text-sub whitespace-pre-wrap">
                  {objection.detailReason}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-h4 text-text-default">내가 제출한 피드백</h3>
            <div className="flex flex-col gap-8 rounded-xl border border-gray-300 p-6">
              {feedbackQuestions.map((question) => (
                <MyQaFeedbackQuestionView
                  key={question.id}
                  question={question}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { MyQaParticipationDetailDialog };
export type { MyQaParticipationDetailDialogProps };
