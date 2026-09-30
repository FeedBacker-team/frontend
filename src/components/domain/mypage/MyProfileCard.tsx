'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { chipVariants } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import { ProfileEditDialog } from '@/components/domain/mypage/ProfileEditDialog';
import { PROFILE_ROLE_LABEL } from '@/constants/profile';
import type { ProfileInterest, ProfileRole } from '@/apis/users';
import { useTags } from '@/hooks/useTags';

type MyProfileCardProps = {
  nickname: string;
  role: ProfileRole;
  introLink: string;
  tags: ProfileInterest[];
};

function MyProfileCard({ nickname, role, introLink, tags }: MyProfileCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: tagOptions = [] } = useTags();
  const tagLabelByCode = Object.fromEntries(
    tagOptions.map(({ code, displayName }) => [code, displayName])
  );

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-gray-50 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-15 shrink-0 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-1">
            <h2 className="text-h2 text-text-default">{nickname}</h2>
            <p className="text-b3 text-text-sub">{PROFILE_ROLE_LABEL[role]}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="medium"
          onClick={() => setIsEditOpen(true)}
        >
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
              {tagLabelByCode[tag] ?? tag}
            </li>
          ))}
        </ul>
      </div>

      <ProfileEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        defaultValues={{ nickname, role, intro_link: introLink, interests: tags }}
      />
    </section>
  );
}

export { MyProfileCard };
export type { MyProfileCardProps };
