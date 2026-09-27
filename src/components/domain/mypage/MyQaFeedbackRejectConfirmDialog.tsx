'use client';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

type MyQaFeedbackRejectConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const NOTICES = [
  '테스터가 거절에 대해 이의를 제기할 수 있어요.',
  '운영팀 확인 후, 부당한 거절로 판단되면 습도가 차감돼요.',
  '성실히 작성된 피드백이라면 수락을 고려해 주세요.',
];

function MyQaFeedbackRejectConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: MyQaFeedbackRejectConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-125">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 shrink-0 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title="정말 이 피드백을 거절할까요?"
          description={
            <>
              거절 시 테스터에게 작성하신 사유가 전달되며,
              <br />
              보상 도토리가 지급되지 않아요.
            </>
          }
        />

        <div className="flex flex-col gap-2 rounded-lg bg-bg-light p-4">
          <p className="text-b2 font-bold text-text-default">
            부당한 거절 시 나무 습도가 차감될 수 있어요.
          </p>
          <ul className="flex flex-col gap-1">
            {NOTICES.map((notice) => (
              <li key={notice} className="flex gap-1.5 text-c1 text-text-sub">
                <span aria-hidden>•</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" size="medium" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-rust-600 bg-white px-4 py-2.5 text-c1 font-bold text-rust-600 whitespace-nowrap outline-none transition-colors select-none hover:bg-rust-50 active:bg-rust-100 focus-visible:ring-2 focus-visible:ring-ring"
          >
            거절하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyQaFeedbackRejectConfirmDialog };
export type { MyQaFeedbackRejectConfirmDialogProps };
