'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaEarlyCloseConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function QaEarlyCloseConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: QaEarlyCloseConfirmDialogProps) {
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
          title="QA 모집을 조기 마감하시겠어요?"
          description={
            <>
              지금까지 제출된 피드백은 그대로 유지되며,
              <br />더 이상 새로운 테스터가 참여할 수 없어요.
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
            취소
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={onConfirm}
          >
            조기 마감하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaEarlyCloseConfirmDialog };
export type { QaEarlyCloseConfirmDialogProps };
