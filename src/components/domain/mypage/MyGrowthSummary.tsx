'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Badge } from '@/components/common/Badge';
import { MyAcornHistoryDialog } from '@/components/domain/mypage/MyAcornHistoryDialog';
import { MyGrowthInfoDialog } from '@/components/domain/mypage/MyGrowthInfoDialog';
import {
  ACORN_TRANSACTIONS_PAGE_SIZE,
  getTreeStageByHumidity,
} from '@/constants/mypage';
import type { AcornTransactionItem } from '@/types/mypage';

type MyGrowthSummaryProps = {
  acornCount: number;
  acornTransactions: AcornTransactionItem[];
  humidity: number;
};

function MyGrowthSummary({
  acornCount,
  acornTransactions,
  humidity,
}: MyGrowthSummaryProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAcornHistoryOpen, setIsAcornHistoryOpen] = useState(false);
  const { stage: treeStage, stageLabel: treeStageLabel, treeImageSrc } =
    getTreeStageByHumidity(humidity);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsInfoOpen(true)}
        className="flex items-center gap-1 self-end text-c1 text-text-sub underline underline-offset-2"
      >
        <span
          aria-hidden
          className="size-4 shrink-0 bg-current mask-[url(/icons/info.svg)] mask-center mask-contain mask-no-repeat"
        />
        나무 단계 · 습도란?
      </button>
      <MyGrowthInfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />

      <div className="grid grid-cols-[77fr_139fr] gap-5">
        <button
          type="button"
          onClick={() => setIsAcornHistoryOpen(true)}
          className="flex items-center gap-3 rounded-2xl bg-gray-50 p-6 text-left"
        >
          <div className="flex flex-1 flex-col gap-2">
            <p className="flex items-center gap-1 text-h4 text-text-default">
              내 도토리 보유량
              <span
                aria-hidden
                className="size-4 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
              />
            </p>
            <p className="flex items-center gap-2 text-t2 text-text-default">
              <Image
                src="/images/acorn.svg"
                alt=""
                aria-hidden
                width={24}
                height={32}
                unoptimized
                className="h-8 w-6 object-contain"
              />
              {acornCount}
            </p>
          </div>
        </button>

        <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">{treeStage}단계</Badge>
              <h3 className="text-h4 text-yellow-800">{treeStageLabel}</h3>
            </div>
            <p className="flex items-center gap-1 text-c1 text-green-700">
              <span
                aria-hidden
                className="size-4 shrink-0 bg-current mask-[url(/icons/droplet.svg)] mask-center mask-contain mask-no-repeat"
              />
              습도 {humidity}%
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={treeImageSrc}
              alt=""
              aria-hidden
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 shrink-0 object-contain"
            />
            <div
              role="progressbar"
              aria-label="나무 습도"
              aria-valuenow={humidity}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
            >
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${humidity}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <MyAcornHistoryDialog
        open={isAcornHistoryOpen}
        onOpenChange={setIsAcornHistoryOpen}
        acornCount={acornCount}
        transactions={acornTransactions}
        pageSize={ACORN_TRANSACTIONS_PAGE_SIZE}
      />
    </div>
  );
}

export { MyGrowthSummary };
export type { MyGrowthSummaryProps };
