'use client';

import Image from 'next/image';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import type { ActiveQaSummary, QaRecruitableProject } from '@/types/qa';

type QaRecruitInProgressDialogProps = {
  open: boolean;
  qa: ActiveQaSummary;
  project: QaRecruitableProject;
  onClose: () => void;
  onViewProgress: (feedbackPostId: string) => void;
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function QaRecruitInProgressDialog({
  open,
  qa,
  project,
  onClose,
  onViewProgress,
}: QaRecruitInProgressDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-136">
        <DialogHeader
          icon={
            <span
              aria-hidden
              className="block size-8 bg-rust-600 mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          title="이미 진행 중인 QA 모집이 있어요"
          description={
            <>
              한 프로젝트에는 하나의 모집만 열 수 있어요.
              <br />
              진행 중인 모집이 종료된 후에 새로운 QA 모집을 시작해 주세요.
            </>
          }
        />

        <DialogBody>
          <article className="flex min-w-0 items-center gap-3 overflow-hidden rounded-[12px] bg-bg-light px-5 py-4">
            <div className="relative size-13 shrink-0 overflow-hidden rounded-[4px] bg-[#d9d9d9]">
              {qa.thumbnailUrl || project.thumbnailUrl ? (
                <Image
                  src={qa.thumbnailUrl ?? project.thumbnailUrl ?? ''}
                  alt=""
                  fill
                  unoptimized
                  sizes="52px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden">
              <h3
                title={qa.title ?? project.title}
                className="text-h2 w-full truncate text-text-default"
              >
                {qa.title ?? project.title}
              </h3>
              {qa.startAt && qa.endAt ? (
                <p className="text-c1 text-text-info">
                  {formatDate(qa.startAt)} ~ {formatDate(qa.endAt)}
                </p>
              ) : (
                <p
                  title={project.description}
                  className="text-c1 w-full truncate text-text-sub"
                >
                  {project.description}
                </p>
              )}
            </div>
          </article>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={() => onViewProgress(qa.feedbackPostId)}>
            진행 상황 보기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QaRecruitInProgressDialog };
export type { QaRecruitInProgressDialogProps };
