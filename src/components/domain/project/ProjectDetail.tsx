'use client';

import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { chipVariants } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { ProjectActionBar } from '@/components/domain/project/ProjectActionBar';
import {
  ProjectQaBanner,
  type ProjectQaBannerProps,
} from '@/components/domain/project/ProjectQaBanner';
import Link from 'next/link';

type ProjectDetailProps = {
  projectId: string;
  title: string;
  tags: string[];
  thumbnailUrl?: string | null;
  authorNickname: string;
  authorProfileImageUrl?: string | null;
  publishedAt: string;
  viewCount: number;
  url: string;
  description: string;
  isOwner?: boolean;
  recruitingQa?: ProjectQaBannerProps;
};

function ProjectDetail({
  projectId,
  title,
  tags,
  thumbnailUrl,
  authorNickname,
  authorProfileImageUrl,
  publishedAt,
  viewCount,
  url,
  description,
  isOwner = false,
  recruitingQa,
}: ProjectDetailProps) {
  return (
    <article className="flex w-full flex-col gap-12 rounded-2xl bg-white p-9">
      <div className="flex gap-6">
        <div className="relative size-50 shrink-0 overflow-hidden rounded-xl bg-[#D9D9D9]">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="200px"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
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
          <h1 className="text-t3 font-normal text-text-default">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={authorProfileImageUrl ?? '/icons/basic-avatars.svg'}
                alt=""
                aria-hidden
                width={32}
                height={32}
                unoptimized
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <span className="text-c1 text-gray-900">{authorNickname}</span>
            </div>
            <p className="flex items-center gap-2 text-b3 text-text-info">
              <span>{publishedAt}</span>
              <span aria-hidden className="size-1 rounded-full bg-gray-400" />
              <span>조회 {viewCount}</span>
            </p>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="min-w-0 flex-1">
              <Input
                readOnly
                aria-label="프로젝트 URL"
                value={url}
                size="large"
                className="h-10 border-gray-400"
              />
            </div>
            <Button
              variant="outline"
              size="medium"
              nativeButton={false}
              render={
                <Link href={url} target="_blank" rel="noopener noreferrer" />
              }
              className="h-10 shrink-0 gap-2.5 rounded-xl px-4 font-normal"
              rightIcon={
                <span
                  aria-hidden
                  className="size-5 bg-current mask-[url(/icons/arrow-up-right.svg)] mask-center mask-contain mask-no-repeat"
                />
              }
            >
              방문하기
            </Button>
          </div>
        </div>
      </div>

      {recruitingQa ? <ProjectQaBanner {...recruitingQa} /> : null}

      <hr className="border-gray-300" />

      <section className="flex flex-col gap-3">
        <h2 className="text-b2 text-text-info">프로젝트 설명</h2>
        <MarkdownContent className="text-b2">{description}</MarkdownContent>
      </section>

      {isOwner ? (
        <ProjectActionBar
          projectId={projectId}
          recruitableProject={{
            projectId,
            title,
            description,
            thumbnailUrl: thumbnailUrl ?? null,
            hasActiveQa: Boolean(recruitingQa),
            activeQa: null,
          }}
        />
      ) : null}
    </article>
  );
}

export { ProjectDetail };
export type { ProjectDetailProps };
