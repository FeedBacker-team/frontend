'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaRecruitSubmitConfirmDialogProps = {
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function QaRecruitSubmitConfirmDialog({
  open,
  isPending = false,
  onClose,
  onConfirm,
}: QaRecruitSubmitConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-115">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title={
            <>
              글 등록 후에는 수정할 수 없어요.
              <br />
              이대로 모집을 시작할까요?
            </>
          }
          description={
            <>
              기본 정보나 문항 등 작성하신 내용에
              <br />
              잘못 기재된 부분이 없는지 한 번 더 점검해 보세요.
            </>
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            다시 확인하기
          </Button>
          <Button type="button" disabled={isPending} onClick={onConfirm}>
            {isPending ? '등록 중...' : '이대로 등록하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaRecruitSubmitConfirmDialog };
export type { QaRecruitSubmitConfirmDialogProps };
