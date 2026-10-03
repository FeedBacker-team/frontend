import Image from 'next/image';

import { Badge } from '@/components/common/Badge';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
} from '@/constants/mypage';
import { cn } from '@/lib/utils';
import type { MyQaParticipationItem } from '@/types/mypage';

type MyQaParticipationListItemProps = {
  participation: MyQaParticipationItem;
  onClick?: () => void;
};

function MyQaParticipationListItem({
  participation,
  onClick,
}: MyQaParticipationListItemProps) {
  const {
    title,
    status,
    startDate,
    endDate,
    contentType,
    daysLeft,
    rewardAcorn,
  } = participation;

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'flex items-center gap-4 py-5',
        onClick && 'cursor-pointer text-left'
      )}
    >
      <div className="size-27 shrink-0 rounded-lg bg-gray-200" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Badge
          variant={MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT[status]}
          className="self-start"
        >
          {MY_QA_PARTICIPATION_STATUS_LABEL[status]}
        </Badge>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-h4 truncate text-text-default">{title}</h3>
            <p className="text-c1 text-text-info">
              {startDate} ~ {endDate}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge>{contentType}</Badge>
            {daysLeft === null ? (
              <Badge variant="green">{endDate} 종료</Badge>
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
                  alt="도토리"
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
        </div>
      </div>
    </article>
  );
}

export { MyQaParticipationListItem };
export type { MyQaParticipationListItemProps };
