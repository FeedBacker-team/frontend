'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import { cn } from '@/lib/utils';

type MyQaFeedbackReviewCompleteDialogVariant = 'ACCEPTED' | 'REJECTED';

type MyQaFeedbackReviewCompleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: MyQaFeedbackReviewCompleteDialogVariant;
  feedbackPostId: string;
};

const CONTENT: Record<
  MyQaFeedbackReviewCompleteDialogVariant,
  { title: string; description: ReactNode; iconClassName: string }
> = {
  ACCEPTED: {
    title: '피드백을 수락했어요',
    description: (
      <>
        테스터에게 약속된 보상 도토리가 지급되었어요.
        <br />
        QA 완료에 한 걸음 더 가까워졌어요!
      </>
    ),
    iconClassName: 'mask-[url(/icons/check.svg)]',
  },
  REJECTED: {
    title: '피드백을 거절했어요',
    description: (
      <>
        테스터에게 보상 도토리가 지급되지 않아요.
        <br />
        다음 피드백 검토를 계속 진행해 보세요.
      </>
    ),
    iconClassName: 'mask-[url(/icons/alert-circle.svg)]',
  },
};

function MyQaFeedbackReviewCompleteDialog({
  open,
  onOpenChange,
  variant,
  feedbackPostId,
}: MyQaFeedbackReviewCompleteDialogProps) {
  const router = useRouter();
  const { title, description, iconClassName } = CONTENT[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className={cn(
                'block size-8 shrink-0 bg-rust-600 mask-center mask-contain mask-no-repeat',
                iconClassName
              )}
            />
          }
          title={title}
          description={description}
        />
        <DialogFooter>
          <Button
            onClick={() => router.push(`/mypage/my-qa/${feedbackPostId}`)}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MyQaFeedbackReviewCompleteDialog };
export type {
  MyQaFeedbackReviewCompleteDialogProps,
  MyQaFeedbackReviewCompleteDialogVariant,
};
