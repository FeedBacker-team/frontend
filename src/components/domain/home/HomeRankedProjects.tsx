'use client';

import { useEffect } from 'react';

import { toast } from '@/components/common/Sonner';
import {
  RankedList,
  type RankedListItem,
} from '@/components/domain/shared/RankedList';
import { RANKING_PROJECT_PAGE_SIZE } from '@/constants/project';
import { useProjects } from '@/hooks/useProjects';
import type { ProjectCard } from '@/types/project';

function toRankedItem(project: ProjectCard): RankedListItem {
  return {
    id: String(project.project_id),
    title: project.title,
    description: project.description,
    thumbnailUrl: project.thumbnail_url ?? undefined,
  };
}

function HomeRankedProjects() {
  const popular = useProjects({
    sort: 'VIEW_COUNT',
    page: 0,
    size: RANKING_PROJECT_PAGE_SIZE,
  });
  const webTrend = useProjects({
    sort: 'VIEW_COUNT',
    tags: ['WEB'],
    page: 0,
    size: RANKING_PROJECT_PAGE_SIZE,
  });

  useEffect(() => {
    if (popular.isError || webTrend.isError) {
      toast.error('인기 프로젝트를 불러오지 못했습니다');
    }
  }, [popular.isError, webTrend.isError]);

  return (
    <>
      <RankedList
        title="지금 인기 있는 프로젝트"
        items={popular.data?.projects.map(toRankedItem) ?? []}
        isLoading={popular.isPending}
        isError={popular.isError}
        skeletonCount={RANKING_PROJECT_PAGE_SIZE}
        emptyTitle="아직 관련 프로젝트가 없어요"
        emptyDescription="곧 멋진 프로젝트들로 채워질 예정이에요!"
      />
      <RankedList
        title="요즘 뜨는 # 웹 분야 프로젝트"
        items={webTrend.data?.projects.map(toRankedItem) ?? []}
        isLoading={webTrend.isPending}
        isError={webTrend.isError}
        skeletonCount={RANKING_PROJECT_PAGE_SIZE}
        emptyTitle="아직 관련 프로젝트가 없어요"
        emptyDescription="곧 멋진 프로젝트들로 채워질 예정이에요!"
      />
    </>
  );
}

export { HomeRankedProjects };
