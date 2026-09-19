import { cn } from '@/lib/utils';

const THUMB_CLASS = 'size-13 shrink-0 rounded-lg bg-[#D9D9D9]';

type RankedListItem = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
};

type RankedListProps = {
  title: string;
  items: RankedListItem[];
  isLoading?: boolean;
  skeletonCount?: number;
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

function RankedList({
  title,
  items,
  isLoading = false,
  skeletonCount = 5,
  className,
}: RankedListProps) {
  return (
    <section className={cn('flex w-full flex-col gap-3', className)}>
      <h2 className="text-h4 text-text-default">{title}</h2>
      <ul className="flex flex-col gap-4 rounded-2xl bg-bg-default p-5">
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, index) => (
              <RankedListRowSkeleton key={index} />
            ))
          : items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className={THUMB_CLASS} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-h4 truncate text-text-default">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="text-b3 truncate text-text-subdued">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
      </ul>
    </section>
  );
}

export { RankedList };
export type { RankedListItem, RankedListProps };
