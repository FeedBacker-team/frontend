'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type MyObjectionCompleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MyObjectionCompleteDialog({
  open,
  onOpenChange,
}: MyObjectionCompleteDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 shrink-0 bg-rust-600 mask-[url(/icons/check.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title="이의제기가 접수되었어요"
          description={
            <>
              제출해 주신 내용을 운영팀이 신중하게 검토할 예정이에요.
              <br />
              결과는 마이페이지에서 확인하실 수 있어요.
            </>
          }
        />
        <DialogFooter>
          <Button onClick={() => router.push('/mypage?tab=QA_PARTICIPATION')}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyObjectionCompleteDialog };
export type { MyObjectionCompleteDialogProps };
