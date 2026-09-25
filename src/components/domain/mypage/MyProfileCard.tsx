'use client';

import { Button } from '@/components/common/Button';
import { chipVariants } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';

type MyProfileCardProps = {
  nickname: string;
  role: string;
  introLink: string;
  tags: string[];
};

function MyProfileCard({ nickname, role, introLink, tags }: MyProfileCardProps) {
  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-gray-50 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-15 shrink-0 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-1">
            <h2 className="text-h2 text-text-default">{nickname}</h2>
            <p className="text-b3 text-text-sub">{role}</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="medium">
          프로필 수정
        </Button>
      </div>

      <div className="h-px bg-gray-300" aria-hidden />

      <div className="flex flex-col gap-2">
        <label htmlFor="my-profile-intro-link" className="text-h4 text-text-default">
          나를 소개하는 링크
        </label>
        <Input
          id="my-profile-intro-link"
          readOnly
          tabIndex={-1}
          value={introLink}
          className="cursor-default"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-h4 text-text-default">관심 태그</p>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className={chipVariants({ state: 'checked' })}>
              <span
                aria-hidden
                className="size-3 shrink-0 bg-current mask-[url(/icons/hash.svg)] mask-center mask-contain mask-no-repeat"
              />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { MyProfileCard };
export type { MyProfileCardProps };
