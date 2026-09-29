'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  ImageViewer,
  type ImageViewerItem,
} from '@/components/domain/shared/ImageViewer';
import type { QaRecruitmentDetailResponse } from '@/types/qa';

type QaFeedbackTargetCardProps = {
  qa: QaRecruitmentDetailResponse;
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function QaFeedbackTargetCard({ qa }: QaFeedbackTargetCardProps) {
  const isLinkType = qa.targetType === 'SERVICE_LINK';
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const testImages = [...qa.images].sort((a, b) => a.order - b.order);
  const viewerImages: ImageViewerItem[] = testImages.map((image, index) => ({
    id: `${image.type}-${image.order}`,
    src: image.url,
    alt: `테스트 이미지 ${index + 1}`,
  }));

  return (
    <section className="flex flex-col gap-7 rounded-2xl bg-bg-default p-9">
      <header className="flex items-center gap-3 rounded-xl bg-bg-light p-4">
        <div aria-hidden className="size-14 shrink-0 rounded-lg bg-[#d9d9d9]" />
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-h2 text-text-default">{qa.title}</h1>
          <p className="text-c1 text-text-info">
            {formatDate(qa.startAt)} ~ {formatDate(qa.endAt)}
          </p>
        </div>
      </header>

      {isLinkType ? (
        <div className="flex items-center gap-2 w-125">
          <Input
            readOnly
            aria-label="QA 테스트 URL"
            value={qa.serviceUrl ?? ''}
            className="bg-white"
          />
          <Button
            nativeButton={false}
            render={
              <a
                href={qa.serviceUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="medium"
            disabled={!qa.serviceUrl}
            className="shrink-0"
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
      ) : testImages.length > 0 ? (
        <ol className="flex flex-wrap justify-center gap-6">
          {testImages.map((image, index) => (
            <li
              key={`${image.type}-${image.order}`}
              className="flex w-50 flex-col items-center gap-3"
            >
              <span className="flex size-6.5 items-center justify-center rounded-full bg-bg-light text-c1 text-text-sub">
                {index + 1}
              </span>
              <button
                type="button"
                aria-label={`${index + 1}번째 테스트 이미지 크게 보기`}
                onClick={() => setViewerIndex(index)}
                className="group relative size-50 cursor-pointer overflow-hidden rounded-xl bg-[#d9d9d9] outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={image.url}
                  alt={`테스트 이미지 ${index + 1}`}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                />
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      <ImageViewer
        open={viewerIndex !== null}
        images={viewerImages}
        currentIndex={viewerIndex ?? 0}
        onIndexChange={setViewerIndex}
        onOpenChange={(open) => {
          if (!open) {
            setViewerIndex(null);
          }
        }}
      />
    </section>
  );
}

export { QaFeedbackTargetCard };
export type { QaFeedbackTargetCardProps };
