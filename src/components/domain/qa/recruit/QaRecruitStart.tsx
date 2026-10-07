'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { useActionGuard } from '@/components/domain/auth/ActionGuardProvider';
import { QaProjectRequiredDialog } from '@/components/domain/qa/recruit/QaProjectRequiredDialog';
import {
  QaRecruitDialog,
  type QaRecruitSubmitParams,
} from '@/components/domain/qa/recruit/QaRecruitDialog';
import { QaRecruitInProgressDialog } from '@/components/domain/qa/recruit/QaRecruitInProgressDialog';
import { useMyProjects } from '@/hooks/useProjects';
import { toQaRecruitableProject } from '@/lib/qa/recruitableProjects';
import { useAuthStore } from '@/stores/authStore';
import type { QaRecruitDialogState } from '@/types/qa';

function QaRecruitStart() {
  const router = useRouter();
  const { runProtectedAction } = useActionGuard();
  const authStatus = useAuthStore((state) => state.status);
  const isProfileCompleted = useAuthStore(
    (state) => state.isProfileCompleted
  );
  const isAuthenticated = authStatus === 'authenticated';
  const [openDialog, setOpenDialog] =
    useState<QaRecruitDialogState | null>(null);
  const projectsQuery = useMyProjects({
    enabled: isAuthenticated && isProfileCompleted,
  });
  const projects =
    projectsQuery.data?.map(toQaRecruitableProject) ?? [];
  const activeProject = projects.find(
    (project) => project.hasActiveQa && project.activeQa
  );
  const isAllProjectsRecruiting =
    projects.length > 0 && projects.every((project) => project.hasActiveQa);

  const handleStartRecruitment = () => {
    runProtectedAction(() => {
      if (projectsQuery.isError) {
        toast.error('내 프로젝트 목록을 불러오지 못했습니다');
        return;
      }

      if (projects.length === 0) {
        setOpenDialog('PROJECT_REQUIRED');
        return;
      }

      if (isAllProjectsRecruiting && activeProject?.activeQa) {
        setOpenDialog('IN_PROGRESS');
        return;
      }

      const hasRecruitableProject = projects.some(
        (project) => !project.hasActiveQa
      );

      if (hasRecruitableProject) {
        setOpenDialog('RECRUIT_STEP');
        return;
      }

      if (activeProject) {
        setOpenDialog('IN_PROGRESS');
      }
    });
  };

  const handleViewProgress = (feedbackPostId: string) => {
    setOpenDialog(null);
    router.push(`/qa/${encodeURIComponent(feedbackPostId)}`);
  };

  const handleRecruitSubmit = ({
    projectId,
    targetType,
  }: QaRecruitSubmitParams) => {
    setOpenDialog(null);
    const searchParams = new URLSearchParams({
      projectId,
      target: targetType,
    });

    router.push(`/qa/new?${searchParams.toString()}`);
  };

  return (
    <>
      <Button
        size="medium"
        aria-haspopup="dialog"
        aria-expanded={openDialog !== null}
        data-open-dialog={openDialog ?? undefined}
        disabled={
          isAuthenticated && isProfileCompleted && projectsQuery.isPending
        }
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

      {activeProject?.activeQa ? (
        <QaRecruitInProgressDialog
          open={openDialog === 'IN_PROGRESS'}
          qa={activeProject.activeQa}
          project={activeProject}
          onClose={() => setOpenDialog(null)}
          onViewProgress={handleViewProgress}
        />
      ) : null}

      <QaProjectRequiredDialog
        open={openDialog === 'PROJECT_REQUIRED'}
        onClose={() => setOpenDialog(null)}
        onRegisterProject={() => {
          setOpenDialog(null);
          router.push('/projects/new');
        }}
      />

      <QaRecruitDialog
        open={openDialog === 'RECRUIT_STEP'}
        projects={projects}
        onClose={() => setOpenDialog(null)}
        onSubmit={handleRecruitSubmit}
      />

    </>
  );
}

export { QaRecruitStart };
