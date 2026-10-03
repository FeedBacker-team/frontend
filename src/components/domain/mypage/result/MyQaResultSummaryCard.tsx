import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { chipVariants } from '@/components/common/chip-variants';
import { Input } from '@/components/common/Input';
import type { MyQaResultDetail } from '@/types/mypage';

type MyQaResultSummaryCardProps = Pick<
  MyQaResultDetail,
  | 'title'
  | 'tags'
  | 'authorNickname'
  | 'startDate'
  | 'endDate'
  | 'contentType'
  | 'rewardAcorn'
  | 'reviewUrl'
  | 'reviewImages'
>;

function MyQaResultSummaryCard({
  title,
  tags,
  authorNickname,
  startDate,
  endDate,
  contentType,
  rewardAcorn,
  reviewUrl,
  reviewImages,
}: MyQaResultSummaryCardProps) {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-gray-300 bg-white p-7">
      <div className="flex gap-6">
        <div className="size-35 shrink-0 rounded-lg bg-gray-200" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
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
          <h2 className="text-h2 text-text-default">{title}</h2>
          <div className="flex items-center gap-2 text-c1 text-text-sub">
            <span className="size-5 shrink-0 rounded-full bg-gray-200" />
            {authorNickname}
            <span aria-hidden>·</span>
            {startDate} ~ {endDate}
          </div>
          <div className="flex items-center gap-2">
            <Badge>{contentType}</Badge>
            <Badge>{endDate} 종료</Badge>
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

      <hr className="border-gray-300" />

      {contentType === '이미지형' && reviewImages && reviewImages.length > 0 && (
        <div className="flex gap-6">
          {reviewImages.map((image, index) => (
            <div key={image} className="flex flex-col items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-c1 text-text-sub">
                {index + 1}
              </span>
              <div className="size-45 shrink-0 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {contentType === '링크형' && reviewUrl && (
        <div className="flex w-125 items-center gap-2">
          <div className="min-w-0 flex-1">
            <Input
              readOnly
              aria-label="QA 콘텐츠 URL"
              value={reviewUrl}
              size="large"
              className="h-10 border-gray-400"
            />
          </div>
          <Button
            variant="outline"
            size="medium"
            nativeButton={false}
            render={
              <Link href={reviewUrl} target="_blank" rel="noopener noreferrer" />
            }
            className="h-10 shrink-0 gap-2.5 rounded-xl px-4 font-normal"
            rightIcon={
              <span
                aria-hidden
                className="size-5 bg-current mask-[url(/icons/arrow-up-right.svg)] mask-center mask-contain mask-no-repeat"
              />
            }
          >
            열기
          </Button>
        </div>
      )}
    </section>
  );
}

export { MyQaResultSummaryCard };
export type { MyQaResultSummaryCardProps };
