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

  return (
    <RankedList
      title="도토리 가득! 혜택이 큰 QA"
      items={items}
      isLoading={isPending}
      skeletonCount={RANKING_QA_SIZE}
    />
  );
}

export { QaRewardRankings };
