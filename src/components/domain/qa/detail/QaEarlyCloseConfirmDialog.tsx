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
  isPending?: boolean;
  /** 모집 마감 후 완료 처리하는 경우 '조기 마감' 대신 '완료 처리' 문구를 보여준다. */
  mode?: 'earlyClose' | 'complete';
};

function QaEarlyCloseConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  mode = 'earlyClose',
}: QaEarlyCloseConfirmDialogProps) {
  const isComplete = mode === 'complete';

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
          title={
            isComplete
              ? 'QA를 완료 처리하시겠어요?'
              : 'QA 모집을 조기 마감하시겠어요?'
          }
          description={
            isComplete ? (
              <>
                완료 처리하면 더 이상 피드백을 검토할 수 없으며,
                <br />이 QA가 속한 프로젝트를 삭제할 수 있게 됩니다.
              </>
            ) : (
              <>
                지금까지 제출된 피드백은 그대로 유지되며,
                <br />더 이상 새로운 테스터가 참여할 수 없어요.
              </>
            )
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
            취소
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending
              ? isComplete
                ? '처리 중...'
                : '마감 중...'
              : isComplete
                ? '완료 처리하기'
                : '조기 마감하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaEarlyCloseConfirmDialog };
export type { QaEarlyCloseConfirmDialogProps };
