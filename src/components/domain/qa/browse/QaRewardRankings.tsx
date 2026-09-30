'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { toast } from '@/components/common/Sonner';
import {
  RankedList,
  type RankedListItem,
} from '@/components/domain/shared/RankedList';
import { useQaRecruitments } from '@/hooks/useQaRecruitments';

const RANKING_QA_SIZE = 5;

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
  const { data, isPending, isError } = useQaRecruitments({
    sort: 'REWARD',
    page: 0,
    size: RANKING_QA_SIZE,
  });

  useEffect(() => {
    if (isError) {
      toast.error('QA 도토리 랭킹을 불러오지 못했습니다');
    }
  }, [isError]);

  const items: RankedListItem[] =
    data?.feedbackPosts.map((qa) => ({
      id: String(qa.feedbackPostId),
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
    />
  );
}

export { QaRewardRankings, QaRewardRankingsSkeleton };
