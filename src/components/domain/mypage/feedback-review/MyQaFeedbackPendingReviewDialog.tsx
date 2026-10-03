'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type MyQaFeedbackPendingReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingCount: number;
  onReview: () => void;
};

function MyQaFeedbackPendingReviewDialog({
  open,
  onOpenChange,
  pendingCount,
  onReview,
}: MyQaFeedbackPendingReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-136">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 shrink-0 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title={`아직 처리하지 않은 피드백이 ${pendingCount}건 있어요`}
          description={
            <>
              제출된 피드백의 수락 여부를 결정해야
              <br />
              QA 모집을 종료할 수 있어요.
            </>
          }
        />
        <DialogFooter>
          <Button
            variant="outline"
            size="medium"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
          <Button size="medium" onClick={onReview}>
            피드백 검토하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyQaFeedbackPendingReviewDialog };
export type { MyQaFeedbackPendingReviewDialogProps };
