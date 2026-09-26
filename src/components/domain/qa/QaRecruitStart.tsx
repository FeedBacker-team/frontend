'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { QaRecruitDialog } from '@/components/domain/qa/QaRecruitDialog';
import { QaRecruitInProgressDialog } from '@/components/domain/qa/QaRecruitInProgressDialog';
import { MOCK_QA_RECRUITABLE_PROJECTS } from '@/mocks/qa';
import type { QaRecruitDialogState } from '@/types/qa';

function QaRecruitStart() {
  const [openDialog, setOpenDialog] =
    useState<QaRecruitDialogState | null>(null);
  // const [isAllProjectsRecruiting] = useState(true);
  const [isAllProjectsRecruiting] = useState(false);
  const activeQa = MOCK_QA_RECRUITABLE_PROJECTS.find(
    (project) => project.hasActiveQa
  )?.activeQa;

  const handleStartRecruitment = () => {
    if (isAllProjectsRecruiting && activeQa) {
      setOpenDialog('IN_PROGRESS');
      return;
    }

    const hasRecruitableProject = MOCK_QA_RECRUITABLE_PROJECTS.some(
      (project) => !project.hasActiveQa
    );
    const hasActiveQa = MOCK_QA_RECRUITABLE_PROJECTS.some(
      (project) => project.hasActiveQa
    );

    if (hasRecruitableProject) {
      setOpenDialog('RECRUIT_STEP');
      return;
    }

    if (hasActiveQa) {
      setOpenDialog('IN_PROGRESS');
    }
  };

  const handleViewProgress = () => {
    setOpenDialog(null);
  };

  const handleRecruitSubmit = () => {
    setOpenDialog(null);
  };

  return (
    <>
      <Button
        size="medium"
        aria-haspopup="dialog"
        aria-expanded={openDialog !== null}
        data-open-dialog={openDialog ?? undefined}
        onClick={handleStartRecruitment}
        leftIcon={
          <span
            aria-hidden
            className="size-5 bg-gray-50 mask-[url(/icons/megaphone.svg)] mask-center mask-contain mask-no-repeat"
          />
        }
      >
        내 QA 모집글 작성하기
      </Button>

      {activeQa ? (
        <QaRecruitInProgressDialog
          open={openDialog === 'IN_PROGRESS'}
          qa={activeQa}
          onClose={() => setOpenDialog(null)}
          onViewProgress={handleViewProgress}
        />
      ) : null}

      <QaRecruitDialog
        open={openDialog === 'RECRUIT_STEP'}
        projects={MOCK_QA_RECRUITABLE_PROJECTS}
        onClose={() => setOpenDialog(null)}
        onSubmit={handleRecruitSubmit}
      />
    </>
  );
}

export { QaRecruitStart };
