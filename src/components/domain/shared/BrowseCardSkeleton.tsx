import { cn } from '@/lib/utils';

const BAR = 'rounded-md bg-bg-deep';
const PILL = 'h-9 rounded-full bg-bg-deep';

function BrowseCardSkeleton() {
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

export { BrowseCardSkeleton };
