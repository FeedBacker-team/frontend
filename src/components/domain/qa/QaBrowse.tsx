'use client';

import { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';

import { toast } from '@/components/common/Sonner';
import { QaBrowseCard } from '@/components/domain/qa/QaBrowseCard';
import { QaRecruitStart } from '@/components/domain/qa/QaRecruitStart';
import { BrowseCardSkeleton } from '@/components/domain/shared/BrowseCardSkeleton';
import { BrowseSection } from '@/components/domain/shared/BrowseSection';
import { PROJECT_TAG_LABEL, PROJECT_TAGS } from '@/constants/project';
import { useQaRecruitments } from '@/hooks/useQaRecruitments';
import type { QaSort } from '@/types/qa';
import type { ProjectTag } from '@/types/project';

const QA_SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'DEADLINE', label: '마감 임박 순' },
] as const;

const BROWSE_QA_PAGE_SIZE = 5;

function QaBrowse() {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [sort, setSort] = useState<QaSort>('LATEST');
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useQaRecruitments({
    keyword: keyword || undefined,
    tags: selectedTags.length ? selectedTags : undefined,
    sort,
    page: page - 1,
    size: BROWSE_QA_PAGE_SIZE,
  });

  const qas = data?.feedbackPosts ?? [];
  const resultCount = data?.totalCount ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(resultCount / BROWSE_QA_PAGE_SIZE)
  );
  const today = new Date();

  useEffect(() => {
    if (isError) {
      toast.error('QA 모집 목록을 불러오지 못했습니다');
    }
  }, [isError]);

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
    setPage(1);
  };

  return (
    <BrowseSection
      title="모집 중인 QA"
      description="동료들의 프로젝트를 직접 테스트하고 피드백을 남겨 포인트를 모아보세요."
      action={<QaRecruitStart />}
      searchPlaceholder="관심 있는 프로젝트나 QA를 검색해 보세요"
      keyword={keywordInput}
      onKeywordChange={setKeywordInput}
      onSearch={() => {
        setKeyword(keywordInput.trim());
        setPage(1);
      }}
      tags={PROJECT_TAGS}
      selectedTagValues={selectedTags}
      onToggleTag={handleToggleTag}
      onResetTags={() => {
        setSelectedTags([]);
        setPage(1);
      }}
      resultCount={isPending ? 0 : resultCount}
      emptyTitle="조건에 맞는 QA 모집 글이 없어요"
      sortOptions={QA_SORT_OPTIONS}
      sortValue={sort}
      onSortChange={(value) => {
        setSort(value as QaSort);
        setPage(1);
      }}
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
          ? Array.from({ length: BROWSE_QA_PAGE_SIZE }, (_, index) => (
              <li key={index}>
                <BrowseCardSkeleton />
              </li>
            ))
          : isError
            ? (
                <li className="text-b2 rounded-2xl bg-bg-deep px-5 py-16 text-center text-text-sub">
                  QA 모집 목록을 불러오지 못했습니다
                </li>
              )
            : qas.map((qa) => (
                <li key={qa.feedbackPostId}>
                  <QaBrowseCard
                    title={qa.title}
                    thumbnailUrl={qa.thumbnailUrl}
                    tags={qa.tags.map((tag) => PROJECT_TAG_LABEL[tag])}
                    targetType={qa.targetType}
                    startAt={qa.startAt}
                    endAt={qa.endAt}
                    capacity={qa.capacity}
                    participantCount={qa.participantCount}
                    requiredAcorns={qa.requiredAcorns}
                    daysRemaining={Math.max(
                      0,
                      differenceInCalendarDays(new Date(qa.endAt), today)
                    )}
                  />
                </li>
              ))}
      </ul>
    </BrowseSection>
  );
}

export { QaBrowse };
