'use client';

import { chipVariants } from '@/components/common/Chip';
import { cn } from '@/lib/utils';

type ProjectBrowseCardProps = {
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  viewCount: number;
  className?: string;
};

const BAR = 'rounded-md bg-bg-deep';
const PILL = 'h-9 rounded-full bg-bg-deep';

function ProjectBrowseCard({
  title,
  description,
  tags,
  publishedAt,
  viewCount,
  className,
}: ProjectBrowseCardProps) {
  return (
    <article
      className={cn(
        'flex items-center gap-4 rounded-2xl bg-gray-50 p-5',
        className
      )}
    >
      <div className="size-27 shrink-0 rounded-lg bg-[#D9D9D9]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-h3 truncate text-text-default">{title}</h3>
            <p className="text-b2 truncate text-text-sub">{description}</p>
          </div>
          <p className="text-c1 shrink-0 whitespace-nowrap text-text-info">
            {publishedAt} · 조회 {viewCount}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className={chipVariants({ state: 'unchecked' })}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectBrowseCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex animate-pulse items-center gap-4 rounded-2xl bg-gray-50 p-5"
    >
      <div className="size-27 shrink-0 rounded-lg bg-bg-deep" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className={cn(BAR, 'h-7 w-24')} />
            <div className={cn(BAR, 'h-6 w-full')} />
          </div>
          <div className={cn(BAR, 'h-5 w-36 shrink-0')} />
        </div>
        <div className="flex gap-2">
          <div className={cn(PILL, 'w-16')} />
          <div className={cn(PILL, 'w-18')} />
          <div className={cn(PILL, 'w-16')} />
        </div>
      </div>
    </article>
  );
}

export { ProjectBrowseCard, ProjectBrowseCardSkeleton };
export type { ProjectBrowseCardProps };
