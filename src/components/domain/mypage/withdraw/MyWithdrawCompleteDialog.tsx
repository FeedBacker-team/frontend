'use client';

import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import { cn } from '@/lib/utils';

type MyWithdrawCompleteDialogProps = {
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

function MyWithdrawCompleteDialog({
  open,
  onOpenChange,
}: MyWithdrawCompleteDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100">
        <DialogHeader
          icon={<MaskIcon src="/icons/check.svg" className="bg-rust-600" />}
          title="회원 탈퇴가 완료되었어요"
          description={
            <>
              그동안 서비스를 이용해 주셔서 진심으로 감사드려요.
              <br />더 좋은 모습으로 다시 만날 수 있기를 바라요!
            </>
          }
        />
        <DialogFooter>
          <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyWithdrawCompleteDialog };
export type { MyWithdrawCompleteDialogProps };
