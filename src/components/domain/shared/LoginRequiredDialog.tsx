'use client';

import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import { cn } from '@/lib/utils';

type LoginRequiredDialogProps = {
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

function LoginRequiredDialog({ open, onOpenChange }: LoginRequiredDialogProps) {
  const router = useRouter();

  function handleLogin() {
    onOpenChange(false);
    router.push('/login');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100">
        <DialogHeader
          icon={<MaskIcon src="/icons/key.svg" className="bg-rust-600" />}
          title="로그인 후 참여할 수 있어요"
          description={
            <>
              프로젝트 등록과 QA 모집, QA 참여는
              <br />
              로그인 후 이용할 수 있어요.
            </>
          }
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            둘러보기
          </Button>
          <Button onClick={handleLogin}>로그인하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { LoginRequiredDialog };
export type { LoginRequiredDialogProps };
