'use client';

import { useState, type ReactNode } from 'react';

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
  tags: BrowseTag[];
  maxSelectedTags?: number;
  defaultSelectedTagValues?: string[];
  resultCount: number;
  emptyTitle: string;
  sortOptions: BrowseSortOption[];
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  children: ReactNode;
  totalPages?: number;
  className?: string;
};

function BrowseSection({
  title,
  description,
  action,
  searchPlaceholder,
  tags,
  maxSelectedTags = 5,
  defaultSelectedTagValues = [],
  resultCount,
  emptyTitle,
  sortOptions,
  defaultSortValue,
  onSortChange,
  children,
  totalPages = 1,
  className,
}: BrowseSectionProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedTagValues, setSelectedTagValues] = useState(
    defaultSelectedTagValues
  );
  const [sortValue, setSortValue] = useState(
    defaultSortValue ?? sortOptions[0]?.value ?? ''
  );
  const [page, setPage] = useState(1);

  const atMaxTags = selectedTagValues.length >= maxSelectedTags;

  const toggleTag = (value: string) => {
    setSelectedTagValues((current) => {
      if (current.includes(value)) {
        return current.filter((tag) => tag !== value);
      }
      if (current.length >= maxSelectedTags) {
        return current;
      }
      return [...current, value];
    });
  };

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
          <div className="w-100">
            <Input
              size="large"
              placeholder={searchPlaceholder}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              icon={<img src="/icons/search.svg" alt="" aria-hidden />}
            />
          </div>
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
                    onClick={toggleTag}
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
                  onClick={() => {
                    setSortValue(option.value);
                    onSortChange?.(option.value);
                  }}
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

        {resultCount === 0 ? (
          <BrowseEmpty
            title={emptyTitle}
            onResetTags={() => setSelectedTagValues([])}
          />
        ) : (
          children
        )}

        {resultCount === 0 ? null : (
          <div className="flex items-center justify-center gap-6 pt-2">
            <Button
              variant="outline"
              size="small"
              aria-label="이전 페이지"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
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
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              leftIcon={
                <span
                  aria-hidden
                  className="size-4 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
                />
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

export { BrowseSection };
export type { BrowseSectionProps, BrowseTag, BrowseSortOption };
