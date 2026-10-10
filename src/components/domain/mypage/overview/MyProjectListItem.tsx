'use client';

import Image from 'next/image';
import Link from 'next/link';

import { chipVariants } from '@/components/common/Chip';
import { markdownToPlainText } from '@/lib/markdown/plainText';
import type { MyProjectItem } from '@/types/mypage';

type MyProjectListItemProps = {
  project: MyProjectItem;
};

function MyProjectListItem({ project }: MyProjectListItemProps) {
  const { id, title, description, tags, thumbnailUrl, publishedAt, viewCount } =
    project;

  return (
    <Link href={`/projects/${id}`} className="flex items-center gap-4 py-5">
      <div className="relative size-27 shrink-0 overflow-hidden rounded-lg bg-gray-200">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="108px"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-h4 truncate text-text-default">{title}</h3>
            <p className="text-b3 truncate text-text-sub">
              {markdownToPlainText(description)}
            </p>
          </div>
          <p className="text-c1 shrink-0 whitespace-nowrap text-text-info">
            {publishedAt} · 조회 {viewCount}
          </p>
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
    </Link>
  );
}

export { MyProjectListItem };
export type { MyProjectListItemProps };
