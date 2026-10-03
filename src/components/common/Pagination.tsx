'use client';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-6 pt-2', className)}
    >
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
  );
}

export { Pagination };
export type { PaginationProps };
