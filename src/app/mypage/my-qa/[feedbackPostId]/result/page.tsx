import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MyQaResultAcornCard } from '@/components/domain/mypage/MyQaResultAcornCard';
import { MyQaResultSummaryCard } from '@/components/domain/mypage/MyQaResultSummaryCard';
import { MyQaResultTabs } from '@/components/domain/mypage/MyQaResultTabs';
import { getMyQaResultDetailById } from '@/constants/mypage';

export const metadata: Metadata = {
  title: 'QA 결과',
};

export default async function MyQaResultPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/result'>
) {
  const { feedbackPostId } = await props.params;
  const detail = getMyQaResultDetailById(feedbackPostId);

  if (!detail) {
    notFound();
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
