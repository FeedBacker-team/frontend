'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type QaProjectRequiredDialogProps = {
  open: boolean;
  onClose: () => void;
  onRegisterProject: () => void;
};

function QaProjectRequiredDialog({
  open,
  onClose,
  onRegisterProject,
}: QaProjectRequiredDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-135">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title="아직 등록된 프로젝트가 없어요"
          description={
            <>
              QA 모집 글을 올리기 위해서는 먼저 프로젝트 등록이 필요해요.
              <br />
              프로젝트를 등록하면, 언제든 자유롭게 QA를 모집할 수 있어요.
            </>
          }
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={onRegisterProject}>프로젝트 등록하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaProjectRequiredDialog };
export type { QaProjectRequiredDialogProps };
