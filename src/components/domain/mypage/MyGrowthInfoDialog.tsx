'use client';

import Image from 'next/image';

import { Badge } from '@/components/common/Badge';
import { Dialog, DialogContent } from '@/components/common/Dialog';
import { TREE_STAGES } from '@/constants/mypage';

type MyGrowthInfoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MyGrowthInfoDialog({ open, onOpenChange }: MyGrowthInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-175.75 max-w-[calc(100vw-2rem)] items-center gap-7 pt-6 pb-9">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 flex size-5 cursor-pointer items-center justify-center"
        >
          <Image
            src="/icons/x.svg"
            alt="닫기"
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-t3 text-text-default">습도 · 나무 단계란?</h2>
          <p className="text-b2 text-text-sub">
            습도와 나무 단계는 수락된 QA 피드백과 성실한 활동을 모아 계산한 신뢰
            지표예요.
            <br />
            습도에 따른 나무 등급을 올릴수록 더 높은 신뢰도를 인정받고 다양한
            혜택을 누릴 수 있어요.
          </p>
        </div>

        <ul className="flex gap-6">
          {TREE_STAGES.map((tree) => (
            <li key={tree.stage} className="flex flex-col items-center gap-2">
              <Image
                src={tree.treeImageSrc}
                alt={tree.stageLabel}
                aria-hidden
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 object-contain"
              />
              <Badge variant="yellow">{tree.stage}단계</Badge>
              <p className="text-h4 text-yellow-800">{tree.stageLabel}</p>
              <p className="flex items-center gap-1 text-c1 text-green-700">
                <span
                  aria-hidden
                  className="size-4 shrink-0 bg-current mask-[url(/icons/droplet.svg)] mask-center mask-contain mask-no-repeat"
                />
                {tree.humidityRangeLabel}
              </p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export { MyGrowthInfoDialog };
export type { MyGrowthInfoDialogProps };
