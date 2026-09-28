'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';

const PARTICIPATION_DURATION_SECONDS = 24 * 60 * 60;

type QaParticipationActiveCardProps = {
  deadlineAt: number;
  rewardAcorn: number;
  onFeedback: () => void;
  onAbandon: () => void;
};

function getRemainingSeconds(deadlineAt: number) {
  return Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
}

function formatRemainingTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function QaParticipationActiveCard({
  deadlineAt,
  rewardAcorn,
  onFeedback,
  onAbandon,
}: QaParticipationActiveCardProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(deadlineAt)
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(deadlineAt));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [deadlineAt]);

  const remainingRate = Math.min(
    100,
    (remainingSeconds / PARTICIPATION_DURATION_SECONDS) * 100
  );
  const isExpired = remainingSeconds === 0;

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-bg-default p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-c1 text-text-info">제출까지 남은 시간</h2>
        <p className="text-t1 text-text-default tabular-nums">
          {formatRemainingTime(remainingSeconds)}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="피드백 제출까지 남은 시간"
        aria-valuenow={Math.round(remainingRate)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-bg-light"
      >
        <div
          className="h-full rounded-full bg-rust-600 transition-[width]"
          style={{ width: `${remainingRate}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-h4 text-yellow-700">참여 보상</span>
        <span className="flex items-center gap-1 text-h3 text-yellow-800">
          <Image
            src="/images/acorn.svg"
            alt=""
            aria-hidden
            width={12}
            height={16}
            unoptimized
          />
          {rewardAcorn}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          size="medium"
          className="w-full"
          disabled={isExpired}
          onClick={onFeedback}
        >
          {isExpired ? '제출 시간이 만료되었습니다' : '피드백 하기'}
        </Button>
        <Button
          variant="outline"
          size="medium"
          className="w-full"
          onClick={onAbandon}
        >
          피드백 포기하기
        </Button>
      </div>
    </section>
  );
}

export { QaParticipationActiveCard };
export type { QaParticipationActiveCardProps };
