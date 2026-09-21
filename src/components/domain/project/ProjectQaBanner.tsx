import Image from 'next/image';

import { Button } from '@/components/common/Button';

type ProjectQaBannerProps = {
  title: string;
  slotCapacity: number;
  endDate: string;
  rewardAcorn: number;
};

function ProjectQaBanner({
  title,
  slotCapacity,
  endDate,
  rewardAcorn,
}: ProjectQaBannerProps) {
  return (
    <section
      aria-label="모집 중인 QA"
      className="flex items-center justify-between gap-6 rounded-2xl border border-rust-600 bg-rust-50 p-7"
    >
      <div className="flex min-w-0 flex-col">
        <p className="text-b3 leading-5 text-rust-600">모집 중인 QA</p>
        <h2 className="text-b1 text-text-default">{title}</h2>
        <p className="flex items-center gap-2 text-b3 leading-5 text-text-sub">
          <span>모집 인원 {slotCapacity}</span>
          <span aria-hidden className="size-1 rounded-full bg-gray-400" />
          <span>{endDate} 마감</span>
          <span aria-hidden className="size-1 rounded-full bg-gray-400" />
          <span className="flex items-center gap-1 text-c1 text-yellow-800">
            <Image
              src="/images/acorn.svg"
              alt=""
              aria-hidden
              width={12}
              height={16}
              unoptimized
              className="h-4 w-3 object-contain"
            />
            {rewardAcorn}
          </span>
        </p>
      </div>
      <Button
        size="medium"
        className="shrink-0 font-normal"
        leftIcon={
          <span
            aria-hidden
            className="size-5 bg-gray-50 mask-[url(/icons/test.svg)] mask-center mask-contain mask-no-repeat"
          />
        }
      >
        QA 참여하기
      </Button>
    </section>
  );
}

export { ProjectQaBanner };
export type { ProjectQaBannerProps };
