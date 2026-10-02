'use client';

import { PenLine } from 'lucide-react';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaParticipationConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
};

function QaParticipationConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: QaParticipationConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-115">
        <DialogHeader
          icon={
            <PenLine
              aria-hidden
              className="size-8 text-rust-600"
              strokeWidth={1.5}
            />
          }
          title="QA에 참여하시겠어요?"
          description={
            <>
              참여 후 24시간 이내에 피드백을 제출해야
              <br />보상 도토리가 지급돼요.
            </>
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="large"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            다음에 하기
          </Button>
          <Button
            type="button"
            size="large"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? '참여 중...' : '참여하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaParticipationConfirmDialog };
export type { QaParticipationConfirmDialogProps };
