'use client';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/common/Dialog';
import { cn } from '@/lib/utils';

type ImageViewerItem = {
  id: string;
  src: string;
  alt: string;
};

type ImageViewerProps = {
  open: boolean;
  images: ImageViewerItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
};

function ImageViewer({
  open,
  images,
  currentIndex,
  onIndexChange,
  onOpenChange,
}: ImageViewerProps) {
  const imageCount = images.length;
  const safeIndex =
    imageCount > 0 ? Math.max(0, Math.min(currentIndex, imageCount - 1)) : 0;
  const currentImage = images[safeIndex];
  const canMove = imageCount > 1;

  const moveToPrevious = () => {
    if (!canMove) {
      return;
    }

    onIndexChange((safeIndex - 1 + imageCount) % imageCount);
  };

  const moveToNext = () => {
    if (!canMove) {
      return;
    }

    onIndexChange((safeIndex + 1) % imageCount);
  };

  return (
    <Dialog open={open && currentImage != null} onOpenChange={onOpenChange}>
      <DialogContent
        className="relative w-250 gap-6 bg-gray-600 p-9"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveToPrevious();
          }

          if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveToNext();
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            onOpenChange(false);
          }
        }}
      >
        <DialogHeader className="sr-only" title="테스트 이미지 크게 보기" />

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-gray-800 px-3 py-1.5 text-h4 text-gray-50">
            {safeIndex + 1} / {imageCount}
          </span>
          <button
            type="button"
            aria-label="이미지 뷰어 닫기"
            onClick={() => onOpenChange(false)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-600"
          >
            <span
              aria-hidden
              className="size-7 bg-gray-50 mask-[url(/icons/x.svg)] mask-center mask-contain mask-no-repeat"
            />
          </button>
        </div>

        <div className="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-5">
          <button
            type="button"
            aria-label="이전 이미지"
            disabled={!canMove}
            onClick={moveToPrevious}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-gray-900/60 disabled:invisible"
          >
            <span
              aria-hidden
              className="size-6 bg-gray-50 mask-[url(/icons/chevron-left.svg)] mask-center mask-contain mask-no-repeat"
            />
          </button>

          <div className="relative mx-auto aspect-square w-full max-w-130 overflow-hidden rounded-2xl bg-gray-200">
            {currentImage ? (
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                unoptimized
                sizes="520px"
                className="object-contain"
              />
            ) : null}
          </div>

          <button
            type="button"
            aria-label="다음 이미지"
            disabled={!canMove}
            onClick={moveToNext}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-gray-900/60 disabled:invisible"
          >
            <span
              aria-hidden
              className="size-6 bg-gray-50 mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
            />
          </button>
        </div>

        <ol className="flex items-start justify-center gap-3">
          {images.map((image, index) => {
            const isCurrent = index === safeIndex;

            return (
              <li key={image.id} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`${index + 1}번째 이미지 보기`}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => onIndexChange(index)}
                  className={cn(
                    'relative size-16 cursor-pointer overflow-hidden rounded-lg border-2 bg-gray-300 transition-opacity',
                    isCurrent
                      ? 'border-gray-50 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
                <div className="flex items-center justify-center">
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full text-c1',
                      isCurrent
                        ? 'bg-gray-50 text-text-sub'
                        : 'bg-gray-500 text-text-info'
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
}

export { ImageViewer };
export type { ImageViewerItem, ImageViewerProps };
