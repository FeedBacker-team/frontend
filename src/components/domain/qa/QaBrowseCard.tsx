import Image from 'next/image';

import { chipVariants } from '@/components/common/Chip';
import type { QaTargetType } from '@/types/qa';
import { cn } from '@/lib/utils';

const TARGET_TYPE_LABEL: Record<QaTargetType, string> = {
  SERVICE_LINK: '링크형',
  IMAGE: '이미지형',
};

type QaBrowseCardProps = {
  title: string;
  thumbnailUrl: string | null;
  tags: string[];
  targetType: QaTargetType;
  startAt: string;
  endAt: string;
  capacity: number;
  participantCount: number;
  requiredAcorns: number;
  daysRemaining: number;
  className?: string;
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function QaBrowseCard({
  title,
  thumbnailUrl,
  tags,
  targetType,
  startAt,
  endAt,
  capacity,
  participantCount,
  requiredAcorns,
  daysRemaining,
  className,
}: QaBrowseCardProps) {
  const rewardAcorns = requiredAcorns / capacity;
  const deadlineLabel = daysRemaining === 0 ? 'D-Day' : `D-${daysRemaining}`;

  return (
    <article
      className={cn(
        'flex items-center gap-4 rounded-2xl bg-gray-50 p-5',
        className
      )}
    >
      <div className="relative size-27 shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9]">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="108px"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-stretch justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-h3 truncate text-text-default">{title}</h3>
            <p className="text-b3 text-text-info">
              {formatDate(startAt)} ~ {formatDate(endAt)}
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

        <div className="flex shrink-0 flex-col items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gray-100 px-2 py-1 text-c1 text-text-sub">
              {TARGET_TYPE_LABEL[targetType]}
            </span>
            <span
              className={cn(
                'rounded-lg px-2 py-1 text-c1!',
                daysRemaining <= 2
                  ? 'bg-rust-50 text-rust-600'
                  : 'bg-green-50 text-green-600'
              )}
            >
              {deadlineLabel}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-c1 text-yellow-800">
              <Image
                src="/images/acorn.svg"
                alt=""
                aria-hidden
                width={12}
                height={16}
                unoptimized
                className="h-4 w-3 object-contain"
              />
              {rewardAcorns}
            </span>
          </div>

          <p className="flex items-center gap-2 text-c1 text-text-info">
            <span>모집 현황</span>
            <span className="text-h3 text-rust-600">{participantCount}</span>
            <span className="text-h3 text-text-default">/ {capacity}명</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export { QaBrowseCard };
export type { QaBrowseCardProps };
