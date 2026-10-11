'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type MyQaParticipationUnavailableStatus = 'GIVEN_UP' | 'NOT_SUBMITTED';

type MyQaParticipationUnavailableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: MyQaParticipationUnavailableStatus | null;
};

const TITLE: Record<MyQaParticipationUnavailableStatus, string> = {
  GIVEN_UP: '참여를 포기한 QA예요',
  NOT_SUBMITTED: '제출 기한이 지난 QA예요',
};

const DESCRIPTION: Record<MyQaParticipationUnavailableStatus, string> = {
  GIVEN_UP: '참여를 포기해 제출한 피드백이 없어요.',
  NOT_SUBMITTED: '제출 기한 내에 피드백을 제출하지 않았어요.',
};

function MyQaParticipationUnavailableDialog({
  open,
  onOpenChange,
  status,
}: MyQaParticipationUnavailableDialogProps) {
  if (!status) {
    return null;
  }

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
          title={TITLE[status]}
          description={DESCRIPTION[status]}
        />

        <DialogFooter>
          <Button size="large" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyQaParticipationUnavailableDialog };
export type {
  MyQaParticipationUnavailableDialogProps,
  MyQaParticipationUnavailableStatus,
};
