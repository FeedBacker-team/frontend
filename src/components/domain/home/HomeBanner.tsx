'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

import { cn } from '@/lib/utils';

const BANNERS = [
  {
    id: 'squirrel',
    src: '/banner/squirrel_O.png',
    alt: '혼자 하기 힘든 유저 테스트, 동료들과 서로 품앗이하세요!',
  },
  {
    id: 'plain',
    src: '/banner/squirrel_X.png',
    alt: '혼자 하기 힘든 유저 테스트, 동료들과 서로 품앗이하세요!',
  },
] as const;

function HomeBanner() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 10000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [autoplay]
  );
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const frame = requestAnimationFrame(onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="홈 배너"
      className="relative h-81 w-full overflow-hidden rounded-2xl"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {BANNERS.map((banner, slideIndex) => (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              className="flex h-81 min-w-0 shrink-0 grow-0 basis-[calc(100%+24px)]"
            >
              <div className="relative min-h-full min-w-0 flex-1 overflow-hidden rounded-2xl">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={slideIndex === 0}
                  unoptimized
                  className="object-cover"
                  sizes="(min-width: 640px) 1100px, 100vw"
                  draggable={false}
                />
              </div>
              <div className="w-6 shrink-0" aria-hidden />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-6 bottom-4 z-10 flex gap-1.5">
        {BANNERS.map((banner, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <button
              key={banner.id}
              type="button"
              aria-label={`${slideIndex + 1}번째 배너`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => emblaApi?.scrollTo(slideIndex)}
              className={cn(
                'size-1.5 rounded-full transition-colors',
                isActive ? 'bg-gray-700' : 'bg-gray-400'
              )}
            />
          );
        })}
      </div>
    </section>
  );
}

export { HomeBanner };
