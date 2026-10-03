'use client';

import type { CSSProperties } from 'react';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import { cn } from '@/lib/utils';

type ProfileRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MaskIcon({
  src,
  className,
  sizeClassName = 'size-8',
}: {
  src: string;
  className: string;
  sizeClassName?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'block shrink-0 mask-(--dialog-icon) mask-center mask-contain mask-no-repeat',
        sizeClassName,
        className
      )}
      style={{ '--dialog-icon': `url(${src})` } as CSSProperties}
    />
  );
}

function ProfileRequiredDialog({
  open,
  onOpenChange,
}: ProfileRequiredDialogProps) {
  function handleCompleteProfile() {
    onOpenChange(false);
    // TODO: 마이페이지 프로필 수정 페이지 생기면 router.push('/mypage/profile/edit') 등 연동
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100">
        <DialogHeader
          icon={<MaskIcon src="/icons/mypage.svg" className="bg-rust-600" />}
          title="프로필을 완성해 주세요"
          description={
            <>
              프로젝트 등록과 QA 모집, QA 참여는
              <br />
              프로필을 작성한 후에 이용하실 수 있어요.
            </>
          }
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button onClick={handleCompleteProfile}>프로필 완성하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProfileRequiredDialog };
export type { ProfileRequiredDialogProps };
