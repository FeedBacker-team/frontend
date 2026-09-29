'use client';

import { Bookmark } from 'lucide-react';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaFeedbackDraftExitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onSaveAndExit: () => void;
};

function QaFeedbackDraftExitDialog({
  open,
  onOpenChange,
  onContinue,
  onSaveAndExit,
}: QaFeedbackDraftExitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-115">
        <DialogHeader
          icon={
            <Bookmark
              aria-hidden
              className="size-8 text-rust-600"
              strokeWidth={1.5}
            />
          }
          title="작성 중인 내용을 저장하고 나갈까요?"
          description={
            <>
              지금까지 입력한 답변은 저장되고,
              <br />나중에 이어서 작성할 수 있어요.
            </>
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={onContinue}
          >
            계속 작성하기
          </Button>
          <Button type="button" size="large" onClick={onSaveAndExit}>
            저장하고 나가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaFeedbackDraftExitDialog };
export type { QaFeedbackDraftExitDialogProps };
