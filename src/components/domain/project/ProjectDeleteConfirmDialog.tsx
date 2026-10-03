'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type ProjectDeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
};

function ProjectDeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: ProjectDeleteConfirmDialogProps) {
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
          title="프로젝트를 삭제하시겠어요?"
          description={
            <>
              삭제한 프로젝트는 더 이상 조회할 수 없어요.
              <br />
              진행 중인 QA가 있으면 삭제할 수 없어요.
            </>
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={onConfirm}
            disabled={isPending}
          >
            삭제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProjectDeleteConfirmDialog };
export type { ProjectDeleteConfirmDialogProps };
