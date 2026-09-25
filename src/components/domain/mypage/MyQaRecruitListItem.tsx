'use client';

import Image from 'next/image';

import { Badge } from '@/components/common/Badge';
import { chipVariants } from '@/components/common/Chip';
import { QA_URGENT_DAYS_LEFT_THRESHOLD } from '@/constants/mypage';
import type { MyQaRecruitItem } from '@/types/mypage';

type MyQaRecruitListItemProps = {
  recruit: MyQaRecruitItem;
};

function MyQaRecruitListItem({ recruit }: MyQaRecruitListItemProps) {
  const {
    title,
    tags,
    startDate,
    endDate,
    contentType,
    daysLeft,
    rewardAcorn,
    recruitedCount,
    capacity,
  } = recruit;
  const isRecruiting = daysLeft !== null;

  return (
    <article className="flex items-center gap-4 py-5">
      <div className="size-27 shrink-0 rounded-lg bg-gray-200" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-h4 truncate text-text-default">{title}</h3>
            <p className="text-c1 text-text-info">
              {startDate} ~ {endDate}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge>{contentType}</Badge>
              {daysLeft === null ? (
                <Badge>{endDate} 종료</Badge>
              ) : (
                <Badge
                  variant={
                    daysLeft <= QA_URGENT_DAYS_LEFT_THRESHOLD ? 'rust' : 'green'
                  }
                >
                  D-{daysLeft}
                </Badge>
              )}
              <Badge
                variant="yellow"
                icon={
                  <Image
                    src="/images/acorn.svg"
                    alt=""
                    aria-hidden
                    width={17}
                    height={17}
                    unoptimized
                  />
                }
              >
                {rewardAcorn}
              </Badge>
            </div>
            {isRecruiting ? (
              <p className="text-c1 text-text-sub">
                모집 현황{' '}
                <span className="text-rust-600">{recruitedCount}</span> /{' '}
                {capacity}명
              </p>
            ) : null}
          </div>
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

export { MyQaRecruitListItem };
export type { MyQaRecruitListItemProps };
