'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaParticipationAbandonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
};

function QaParticipationAbandonDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: QaParticipationAbandonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-115">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title="피드백을 포기할까요?"
          description={
            <>
              지금 중단하면 이 QA에 다시 참여할 수 없어요.
              <br />작성한 내용은 삭제되며, 보상 도토리는 받을 수 없어요.
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
            계속 작성하기
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? '포기 중...' : '피드백 포기하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaParticipationAbandonDialog };
export type { QaParticipationAbandonDialogProps };
