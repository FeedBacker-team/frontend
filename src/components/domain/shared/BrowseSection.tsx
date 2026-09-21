'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Tag } from '@/components/common/Tag';
import { BrowseEmpty } from '@/components/domain/shared/BrowseEmpty';
import { cn } from '@/lib/utils';

type BrowseTag = {
  value: string;
  label: string;
};

type BrowseSortOption = {
  value: string;
  label: string;
};

type BrowseSectionProps = {
  title: string;
  description: string;
  action?: ReactNode;
  searchPlaceholder: string;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  tags: BrowseTag[];
  selectedTagValues: string[];
  onToggleTag: (value: string) => void;
  onResetTags: () => void;
  maxSelectedTags?: number;
  resultCount: number;
  emptyTitle: string;
  sortOptions: BrowseSortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  children: ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
};

function BrowseSection({
  title,
  description,
  action,
  searchPlaceholder,
  keyword,
  onKeywordChange,
  onSearch,
  tags,
  selectedTagValues,
  onToggleTag,
  onResetTags,
  maxSelectedTags = 5,
  resultCount,
  emptyTitle,
  sortOptions,
  sortValue,
  onSortChange,
  children,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  isError = false,
  className,
}: BrowseSectionProps) {
  const atMaxTags = selectedTagValues.length >= maxSelectedTags;
  const showEmpty = !isLoading && !isError && resultCount === 0;
  const showPagination = !isLoading && !isError && resultCount > 0;

  return (
    <section className={cn('flex w-full min-w-0 flex-col gap-13', className)}>
      <div className="flex flex-col gap-7">
        <header className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-t2 text-text-default">{title}</h2>
            <p className="text-b2 text-text-sub">{description}</p>
          </div>
          {action}
        </header>

        <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-5">
          <form
            className="w-100"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
          >
            <Input
              size="large"
              placeholder={searchPlaceholder}
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              icon={
                <button
                  type="submit"
                  aria-label="검색"
                  className="cursor-pointer"
                >
                  <img src="/icons/search.svg" alt="" aria-hidden />
                </button>
              }
            />
          </form>
          <div className="flex items-end gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTagValues.includes(tag.value);

                return (
                  <Tag
                    key={tag.value}
                    value={tag.value}
                    label={tag.label}
                    selected={selected}
                    disabled={!selected && atMaxTags}
                    onClick={onToggleTag}
                  />
                );
              })}
            </div>
            <p className="text-c1 shrink-0 text-text-sub">
              선택된 태그 {selectedTagValues.length} / {maxSelectedTags}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-h4 text-text-default">검색 결과 {resultCount}건</p>
          <div className="flex items-center gap-2">
            {sortOptions.map((option, index) => (
              <div key={option.value} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-h4 text-text-disabled" aria-hidden>
                    |
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    'text-h4 cursor-pointer',
                    sortValue === option.value
                      ? 'text-text-default'
                      : 'text-text-disabled'
                  )}
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {showEmpty ? (
          <BrowseEmpty title={emptyTitle} onResetTags={onResetTags} />
        ) : (
          children
        )}

        {showPagination ? (
          <div className="flex items-center justify-center gap-6 pt-2">
            <Button
              variant="outline"
              size="small"
              aria-label="이전 페이지"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              leftIcon={
                <span
                  aria-hidden
                  className="size-4 bg-current mask-[url(/icons/chevron-left.svg)] mask-center mask-contain mask-no-repeat"
                />
              }
            />
            <p className="text-h4 text-text-default">
              {String(page).padStart(2, '0')}
              <span className="text-text-disabled">
                {' / '}
                {String(totalPages).padStart(2, '0')}
              </span>
            </p>
            <Button
              variant="outline"
              size="small"
              aria-label="다음 페이지"
              disabled={page >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              leftIcon={
                <span
                  aria-hidden
                  className="size-4 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
                />
              }
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { BrowseSection };
export type { BrowseSectionProps, BrowseTag, BrowseSortOption };
