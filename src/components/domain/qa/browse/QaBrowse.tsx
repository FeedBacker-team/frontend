'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { toast } from '@/components/common/Sonner';
import { QaBrowseCard } from '@/components/domain/qa/browse/QaBrowseCard';
import { QaRecruitStart } from '@/components/domain/qa/recruit/QaRecruitStart';
import { BrowseCardSkeleton } from '@/components/domain/shared/BrowseCardSkeleton';
import { BrowseSection } from '@/components/domain/shared/BrowseSection';
import { PROJECT_TAG_LABEL, PROJECT_TAGS } from '@/constants/project';
import { BROWSE_QA_PAGE_SIZE, QA_SORT_OPTIONS } from '@/constants/qa';
import { useQaRecruitments } from '@/hooks/useQaRecruitments';
import { getQaDaysRemaining } from '@/lib/qa/deadline';
import { useBrowseQuery } from '@/hooks/useBrowseQuery';

function QaBrowse() {
  const {
    keywordInput,
    setKeywordInput,
    keyword,
    selectedTags,
    sort,
    page,
    setPage,
    search,
    toggleTag,
    resetTags,
    setSort,
  } = useBrowseQuery(QA_SORT_OPTIONS, 'LATEST');

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

  return (
    <BrowseSection
      title="사이드 프로젝트 유저 테스트·QA 모집"
      headingLevel={1}
      description="다른 메이커의 서비스를 직접 테스트하고 사용성 피드백을 남기거나, 내 서비스의 QA 참여자를 모집해 보세요."
      action={<QaRecruitStart />}
      searchPlaceholder="관심 있는 프로젝트나 QA를 검색해 보세요"
      keyword={keywordInput}
      onKeywordChange={setKeywordInput}
      onSearch={search}
      tags={PROJECT_TAGS}
      selectedTagValues={selectedTags}
      onToggleTag={toggleTag}
      onResetTags={resetTags}
      resultCount={isPending ? 0 : resultCount}
      emptyTitle="조건에 맞는 QA 모집 글이 없어요"
      sortOptions={QA_SORT_OPTIONS}
      sortValue={sort}
      onSortChange={setSort}
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
                  <Link
                    href={`/qa/${qa.feedbackPostId}`}
                    className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
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
                      daysRemaining={getQaDaysRemaining(qa.endAt, today)}
                      isPinned={qa.isPinned}
                    />
                  </Link>
                </li>
              ))}
      </ul>
    </BrowseSection>
  );
}

export { QaBrowse };
