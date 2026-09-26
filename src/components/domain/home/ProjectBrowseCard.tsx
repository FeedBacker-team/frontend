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
              <span
                aria-hidden
                className="size-3 shrink-0 bg-current mask-[url(/icons/hash.svg)] mask-center mask-contain mask-no-repeat"
              />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export { ProjectBrowseCard };
export type { ProjectBrowseCardProps };
