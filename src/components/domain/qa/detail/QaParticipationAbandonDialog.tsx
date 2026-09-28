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
};

function QaParticipationAbandonDialog({
  open,
  onOpenChange,
  onConfirm,
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
          title="피드백 작성을 포기하시겠어요?"
          description={
            <>
              포기하면 QA 참여가 취소되며,
              <br />작성 중인 피드백은 저장되지 않아요.
            </>
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={() => onOpenChange(false)}
          >
            계속 작성하기
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={onConfirm}
          >
            포기하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaParticipationAbandonDialog };
export type { QaParticipationAbandonDialogProps };
