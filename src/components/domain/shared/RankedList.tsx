import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const THUMB_CLASS =
  'relative size-13 shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9]';

type RankedListItem = {
  id: string;
  href?: string;
  title: string;
  description?: ReactNode;
  thumbnailUrl?: string;
};

type RankedListProps = {
  title: string;
  items: RankedListItem[];
  isLoading?: boolean;
  isError?: boolean;
  skeletonCount?: number;
  emptyIconSrc?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string;
  className?: string;
};

function RankedListRowSkeleton() {
  return (
    <li className="flex animate-pulse items-center gap-3">
      <div className={THUMB_CLASS} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-4 w-24 rounded-md bg-bg-deep" />
        <div className="h-3.5 w-full rounded-md bg-bg-deep" />
      </div>
    </li>
  );
}

type RankedListEmptyProps = {
  iconSrc: string;
  title: string;
  description?: string;
};

function RankedListEmpty({
  iconSrc,
  title,
  description,
}: RankedListEmptyProps) {
  return (
    <li className="flex flex-col items-center justify-center text-center">
      <span className="flex size-12 items-center justify-center rounded-lg bg-bg-default shadow-[0_4px_12px_rgba(17,17,17,0.14)]">
        <Image
          src={iconSrc}
          alt=""
          aria-hidden
          width={32}
          height={32}
          unoptimized
        />
      </span>
      <div className="mt-5 flex flex-col gap-1">
        <p className="text-h4 text-text-sub">{title}</p>
        {description ? (
          <p className="text-b3 text-text-info">{description}</p>
        ) : null}
      </div>
    </li>
  );
}

function RankedList({
  title,
  items,
  isLoading = false,
  isError = false,
  skeletonCount = 5,
  emptyIconSrc = '/icons/flag.svg',
  emptyTitle,
  emptyDescription,
  errorMessage = '프로젝트를 불러오지 못했어요',
  className,
}: RankedListProps) {
  const showEmptyState =
    !isLoading && !isError && items.length === 0 && Boolean(emptyTitle);
  const renderItemContent = (item: RankedListItem) => (
    <>
      <div className={THUMB_CLASS}>
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="52px"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-h4 truncate text-text-default">{item.title}</p>
        {item.description ? (
          <div className="text-b3 truncate text-text-sub">
            {item.description}
          </div>
        ) : null}
      </div>
    </>
  );
  let content: ReactNode;

  if (isLoading) {
    content = Array.from({ length: skeletonCount }, (_, index) => (
      <RankedListRowSkeleton key={index} />
    ));
  } else if (isError) {
    content = (
      <li role="alert" className="text-b3 text-center text-text-sub">
        {errorMessage}
      </li>
    );
  } else if (items.length === 0 && emptyTitle) {
    content = (
      <RankedListEmpty
        iconSrc={emptyIconSrc}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  } else {
    content = items.map((item) => (
      <li key={item.id}>
        {item.href ? (
          <Link
            href={item.href}
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {renderItemContent(item)}
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            {renderItemContent(item)}
          </div>
        )}
      </li>
    ));
  }

  return (
    <section className={cn('flex w-full flex-col gap-3', className)}>
      <h2 className="text-h4 text-text-default">{title}</h2>
      <ul
        aria-busy={isLoading}
        aria-live="polite"
        className={cn(
          'flex flex-col gap-4 rounded-2xl bg-bg-default p-5',
          (showEmptyState || isError) && 'min-h-92 justify-center'
        )}
      >
        {content}
      </ul>
    </section>
  );
}

export { RankedList };
export type { RankedListItem, RankedListProps };
