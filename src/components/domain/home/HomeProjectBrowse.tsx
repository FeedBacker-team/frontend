'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import {
  ProjectBrowseCard,
  ProjectBrowseCardSkeleton,
} from '@/components/domain/home/ProjectBrowseCard';
import { BrowseSection } from '@/components/domain/shared/BrowseSection';

const MOCK_PROJECTS = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  title: '프로젝트 제목',
  description: '프로젝트 설명',
  tags: ['# 웹', '# B2B', '# AI/ML'],
  publishedAt: '2026-09-09',
  viewCount: 128,
}));

const MOCK_TAGS = [
  { value: 'web', label: '# 웹' },
  { value: 'app', label: '# 앱' },
  { value: 'ai-ml', label: '# AI · ML' },
  { value: 'data', label: '# 데이터' },
  { value: 'cloud', label: '# 클라우드' },
  { value: 'commerce', label: '# 커머스' },
  { value: 'fintech', label: '# 핀테크' },
  { value: 'b2b-saas', label: '# B2B · SaaS' },
  { value: 'contents', label: '# 콘텐츠 · 미디어' },
  { value: 'game', label: '# 게임' },
  { value: 'uxui', label: '# UXUI' },
  { value: 'security', label: '# 보안' },
  { value: 'productivity', label: '# 생산성' },
  { value: 'healthcare', label: '# 헬스케어' },
  { value: 'global', label: '# 글로벌' },
];

function HomeProjectBrowse() {
  const [sortValue, setSortValue] = useState('latest');
  const isLoading = sortValue === 'views';

  return (
    <BrowseSection
      title="프로젝트 둘러보기"
      description="등록된 프로젝트를 살펴보고 다양한 분야의 작업물을 탐색해 보세요."
      action={
        <Button
          size="medium"
          leftIcon={
            <span
              aria-hidden
              className="size-5 bg-gray-50 mask-[url(/icons/flag.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
        >
          내 프로젝트 등록하기
        </Button>
      }
      searchPlaceholder="관심 있는 키워드나 프로젝트를 검색해 보세요"
      tags={MOCK_TAGS}
      resultCount={0}
      emptyTitle="조건에 맞는 프로젝트가 없어요"
      sortOptions={[
        { value: 'latest', label: '최신순' },
        { value: 'views', label: '조회수 순' },
      ]}
      defaultSortValue="latest"
      onSortChange={setSortValue}
      totalPages={99}
    >
      <ul
        className="flex flex-col gap-3"
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index}>
                <ProjectBrowseCardSkeleton />
              </li>
            ))
          : MOCK_PROJECTS.map((project) => (
              <li key={project.id}>
                <ProjectBrowseCard
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  publishedAt={project.publishedAt}
                  viewCount={project.viewCount}
                />
              </li>
            ))}
      </ul>
    </BrowseSection>
  );
}

export { HomeProjectBrowse };
