'use client';

import { Button } from '@/components/common/Button';
import { MyQaResultAcornCard } from '@/components/domain/mypage/result/MyQaResultAcornCard';
import { MyQaResultSummaryCard } from '@/components/domain/mypage/result/MyQaResultSummaryCard';
import { MyQaResultTabs } from '@/components/domain/mypage/result/MyQaResultTabs';
import { useMyQaResultDetail } from '@/hooks/useQaRecruitments';
import { QaApiError } from '@/types/qa';

type MyQaResultViewProps = {
  feedbackPostId: string;
};

function getQaErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof QaApiError ? error.message : fallbackMessage;
}

function MyQaResultLoading() {
  return (
    <div className="flex animate-pulse gap-10" aria-label="QA 결과 불러오는 중">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="h-12 rounded-2xl bg-gray-100" />
        <div className="h-45 rounded-2xl bg-gray-100" />
        <div className="h-80 rounded-2xl bg-gray-100" />
      </div>
      <div className="h-60 w-80 shrink-0 rounded-2xl bg-gray-100" />
    </div>
  );
}

type MyQaResultErrorProps = {
  message: string;
  onRetry: () => void;
};

function MyQaResultError({ message, onRetry }: MyQaResultErrorProps) {
  return (
    <section className="mx-auto flex min-h-100 max-w-220 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-text-default">
          QA 결과를 불러오지 못했습니다
        </h1>
        <p className="text-b2 text-text-sub">{message}</p>
      </div>
      <Button size="medium" onClick={onRetry}>
        다시 시도
      </Button>
    </section>
  );
}

function MyQaResultView({ feedbackPostId }: MyQaResultViewProps) {
  const { data: detail, isPending, isError, error, refetch } =
    useMyQaResultDetail(feedbackPostId);

  if (isPending) {
    return <MyQaResultLoading />;
  }

  if (isError || !detail) {
    return (
      <MyQaResultError
        message={getQaErrorMessage(error, '잠시 후 다시 시도해 주세요.')}
        onRetry={refetch}
      />
    );
  }

  const {
    title,
    tags,
    authorNickname,
    startDate,
    endDate,
    contentType,
    rewardAcorn,
    reviewUrl,
    reviewImages,
    totalAcorn,
    usedAcorn,
    questionStats,
    testerAnswers,
  } = detail;

  return (
    <div className="flex gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-t2 text-text-default">QA 결과</h1>
          <p className="text-b2 text-text-sub">
            테스터들의 피드백을 종합적으로 확인하고, 서비스 개선을 위한 자료로
            활용해 보세요.
          </p>
        </div>

        <MyQaResultSummaryCard
          title={title}
          tags={tags}
          authorNickname={authorNickname}
          startDate={startDate}
          endDate={endDate}
          contentType={contentType}
          rewardAcorn={rewardAcorn}
          reviewUrl={reviewUrl}
          reviewImages={reviewImages}
        />

        <MyQaResultTabs questionStats={questionStats} testerAnswers={testerAnswers} />
      </div>

      <MyQaResultAcornCard totalAcorn={totalAcorn} usedAcorn={usedAcorn} />
    </div>
  );
}

export { MyQaResultView };
export type { MyQaResultViewProps };
