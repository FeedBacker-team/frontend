'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { toast } from '@/components/common/Sonner';
import {
  RankedList,
  type RankedListItem,
} from '@/components/domain/shared/RankedList';
import { useQaRewardRanking } from '@/hooks/useQaRecruitments';

function QaRewardRankingsSkeleton() {
  return (
    <section
      aria-label="QA 도토리 랭킹을 불러오는 중"
      aria-busy="true"
      className="flex animate-pulse items-center gap-4 rounded-xl bg-bg-default p-3"
    >
      <div aria-hidden className="size-18 shrink-0 rounded-md bg-[#D9D9D9]" />
      <div aria-hidden className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-8 w-36 rounded-md bg-bg-deep" />
        <div className="h-7 w-13 rounded-md bg-bg-deep" />
      </div>
    </section>
  );
}

function QaRewardRankings() {
  const { data, isPending, isError } = useQaRewardRanking();

  useEffect(() => {
    if (isError) {
      toast.error('QA 도토리 랭킹을 불러오지 못했습니다');
    }
  }, [isError]);

  const items: RankedListItem[] =
    data?.map((qa) => ({
      id: qa.feedbackPostId,
      href: `/qa/${qa.feedbackPostId}`,
      title: qa.title,
      thumbnailUrl: qa.thumbnailUrl ?? undefined,
      description: (
        <span className="flex items-center gap-1 text-c1 text-yellow-800">
          <Image
            src="/images/acorn.svg"
            alt=""
            aria-hidden
            width={12}
            height={17}
            unoptimized
            className="object-contain"
          />
          {qa.requiredAcorns / qa.capacity}
        </span>
      ),
    })) ?? [];

  if (isPending) {
    return <QaRewardRankingsSkeleton />;
  }

  return (
    <RankedList
      title="도토리 가득! 혜택이 큰 QA"
      items={items}
      isError={isError}
      emptyIconSrc="/icons/megaphone.svg"
      emptyTitle="아직 진행할 QA가 없어요."
      emptyDescription="곧 멋진 QA들로 채워질 예정이에요!"
      errorMessage="QA를 불러오지 못했어요"
    />
  );
}

export { QaRewardRankings, QaRewardRankingsSkeleton };
