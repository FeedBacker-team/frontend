'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import {
  ProjectBrowseCard,
  ProjectBrowseCardSkeleton,
} from '@/components/domain/home/ProjectBrowseCard';
import { BrowseSection } from '@/components/domain/shared/BrowseSection';
import {
  BROWSE_PROJECT_PAGE_SIZE,
  PROJECT_SORT_OPTIONS,
  PROJECT_TAG_LABEL,
  PROJECT_TAGS,
} from '@/constants/project';
import { useProjects } from '@/hooks/useProjects';
import type { ProjectSort, ProjectTag } from '@/types/project';

function HomeProjectBrowse() {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [sort, setSort] = useState<ProjectSort>('LATEST');
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useProjects({
    keyword: keyword || undefined,
    tags: selectedTags.length ? selectedTags : undefined,
    sort,
    page: page - 1,
    size: BROWSE_PROJECT_PAGE_SIZE,
  });

  const projects = data?.projects ?? [];
  const resultCount = data?.total_count ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(resultCount / BROWSE_PROJECT_PAGE_SIZE)
  );

  useEffect(() => {
    if (isError) {
      toast.error('프로젝트 목록을 불러오지 못했습니다');
    }
  }, [isError]);

  const resetPage = () => {
    setPage(1);
  };

  const handleSearch = () => {
    setKeyword(keywordInput.trim());
    resetPage();
  };

  const handleToggleTag = (value: string) => {
    const tag = value as ProjectTag;

    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }
      if (current.length >= 5) {
        return current;
      }
      return [...current, tag];
    });
    resetPage();
  };

  const handleResetTags = () => {
    setSelectedTags([]);
    resetPage();
  };

  const handleSortChange = (value: string) => {
    setSort(value as ProjectSort);
    resetPage();
  };

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
      keyword={keywordInput}
      onKeywordChange={setKeywordInput}
      onSearch={handleSearch}
      tags={PROJECT_TAGS}
      selectedTagValues={selectedTags}
      onToggleTag={handleToggleTag}
      onResetTags={handleResetTags}
      resultCount={isPending ? 0 : resultCount}
      emptyTitle="조건에 맞는 프로젝트가 없어요"
      sortOptions={PROJECT_SORT_OPTIONS}
      sortValue={sort}
      onSortChange={handleSortChange}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      isLoading={isPending}
      isError={isError}
    >
      <ul
        className="flex flex-col gap-3"
        aria-busy={isPending}
        aria-live="polite"
      >
        {isPending
          ? Array.from({ length: BROWSE_PROJECT_PAGE_SIZE }, (_, index) => (
              <li key={index}>
                <ProjectBrowseCardSkeleton />
              </li>
            ))
          : isError
            ? (
                <li className="text-b2 rounded-2xl bg-bg-deep px-5 py-16 text-center text-text-sub">
                  프로젝트 목록을 불러오지 못했습니다
                </li>
              )
            : projects.map((project) => (
                <li key={project.project_id}>
                  <ProjectBrowseCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags.map((tag) => PROJECT_TAG_LABEL[tag])}
                    publishedAt={project.created_at}
                    viewCount={project.view_count}
                  />
                </li>
              ))}
      </ul>
    </BrowseSection>
  );
}

export { HomeProjectBrowse };
