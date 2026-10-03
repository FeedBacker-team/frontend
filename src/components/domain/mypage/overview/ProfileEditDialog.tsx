'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/common/Dialog';
import { ProfileForm } from '@/components/domain/shared/ProfileForm';
import type { UpdateProfileResponse } from '@/apis/users';
import type { ProfileCompleteFormValues } from '@/lib/schemas/profile';

type ProfileEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<ProfileCompleteFormValues>;
  defaultImageUrl?: string | null;
  onSuccess?: (data: UpdateProfileResponse) => void;
};

function ProfileEditDialog({
  open,
  onOpenChange,
  defaultValues,
  defaultImageUrl,
  onSuccess,
}: ProfileEditDialogProps) {
  const handleSuccess = (data: UpdateProfileResponse) => {
    onOpenChange(false);
    onSuccess?.(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <DialogTitle>프로필 수정하기</DialogTitle>
          <DialogClose aria-label="닫기">
            <Image
              src="/icons/x.svg"
              alt=""
              aria-hidden
              width={28}
              height={28}
              unoptimized
            />
          </DialogClose>
        </div>

        <ProfileForm
          mode="edit"
          defaultValues={defaultValues}
          defaultImageUrl={defaultImageUrl}
          submitLabel="프로필 저장"
          onSuccess={handleSuccess}
        />

        {/* <Link
          href="/mypage/withdraw"
          className="text-center text-c1 text-text-sub underline underline-offset-2"
        >
          회원 탈퇴
        </Link> */}
      </DialogContent>
    </Dialog>
  );
}

export { ProfileEditDialog };
export type { ProfileEditDialogProps };
