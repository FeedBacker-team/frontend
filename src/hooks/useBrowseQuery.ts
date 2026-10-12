'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { PROJECT_TAGS } from '@/constants/project';
import type { ProjectTag } from '@/types/project';

function readTags(params: URLSearchParams) {
  return [...new Set((params.get('tags') ?? '').split(','))]
    .filter((tag): tag is ProjectTag =>
      PROJECT_TAGS.some(({ value }) => value === tag)
    )
    .slice(0, 5);
}

/** URL을 목록 상태의 기준으로 사용한다. 검색 입력 중인 값만 로컬에 보관한다. */
function useBrowseQuery<Sort extends string>(
  sortOptions: readonly { value: Sort; label: string }[],
  defaultSort: Sort
) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const params = new URLSearchParams(query);
  const keyword = (params.get('keyword') ?? '').trim();
  const selectedTags = readTags(params);
  const rawPage = params.get('page') ?? '1';
  const parsedPage = Number(rawPage);
  const page =
    /^\d+$/.test(rawPage) && Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;
  const sort =
    sortOptions.find(({ value }) => value === params.get('sort'))?.value ??
    defaultSort;

  const [draft, setDraft] = useState({ query, value: keyword });
  // 뒤로/앞으로 이동하면 검색창도 해당 URL의 확정된 검색어로 복원한다.
  if (draft.query !== query) {
    setDraft({ query, value: keyword });
  }
  const keywordInput = draft.query === query ? draft.value : keyword;

  function updateQuery(update: (next: URLSearchParams) => void) {
    // 연속 클릭에서도 가장 최근 URL을 기준으로 변경한다.
    const url = new URL(window.location.href);
    update(url.searchParams);
    if (url.href !== window.location.href) {
      window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function setPage(nextPage: number) {
    if (!Number.isSafeInteger(nextPage) || nextPage < 1) return;
    updateQuery((next) => next.set('page', String(nextPage)));
  }

  function search() {
    const value = keywordInput.trim();
    setDraft({ query, value });
    updateQuery((next) => {
      if (value) next.set('keyword', value);
      else next.delete('keyword');
      next.set('page', '1');
    });
  }

  function toggleTag(value: string) {
    if (!PROJECT_TAGS.some((tag) => tag.value === value)) return;
    const tag = value as ProjectTag;
    updateQuery((next) => {
      const tags = readTags(next);
      if (!tags.includes(tag) && tags.length >= 5) return;
      const updated = tags.includes(tag)
        ? tags.filter((item) => item !== tag)
        : [...tags, tag];
      if (updated.length) next.set('tags', updated.join(','));
      else next.delete('tags');
      next.set('page', '1');
    });
  }

  function resetTags() {
    updateQuery((next) => {
      next.delete('tags');
      next.set('page', '1');
    });
  }

  function setSort(value: string) {
    if (!sortOptions.some((option) => option.value === value)) return;
    updateQuery((next) => {
      next.set('sort', value);
      next.set('page', '1');
    });
  }

  return {
    page,
    setPage,
    keyword,
    keywordInput,
    setKeywordInput: (value: string) => setDraft({ query, value }),
    selectedTags,
    toggleTag,
    resetTags,
    sort,
    setSort,
    search,
  };
}

export { useBrowseQuery };
