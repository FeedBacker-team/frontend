'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ProjectError } from '@/apis/projects';
import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { ProjectDeleteConfirmDialog } from '@/components/domain/project/ProjectDeleteConfirmDialog';
import {
  QaRecruitDialog,
  type QaRecruitSubmitParams,
} from '@/components/domain/qa/recruit/QaRecruitDialog';
import { useDeleteProject } from '@/hooks/useProjects';
import type { QaRecruitableProject } from '@/types/qa';

function getProjectErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof ProjectError ? error.message : fallbackMessage;
}

type ProjectActionBarProps = {
  projectId: string;
  recruitableProject: QaRecruitableProject;
};

function ProjectActionBar({
  projectId,
  recruitableProject,
}: ProjectActionBarProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRecruitDialogOpen, setIsRecruitDialogOpen] = useState(false);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleDeleteConfirm = () => {
    deleteProject(projectId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('프로젝트를 삭제했습니다');
        router.push('/mypage');
      },
      onError: (error) => {
        setIsDeleteDialogOpen(false);
        toast.error(
          getProjectErrorMessage(error, '프로젝트 삭제에 실패했습니다')
        );
      },
    });
  };

  const handleRecruitSubmit = ({
    projectId: selectedProjectId,
    targetType,
  }: QaRecruitSubmitParams) => {
    setIsRecruitDialogOpen(false);
    const searchParams = new URLSearchParams({
      projectId: selectedProjectId,
      target: targetType,
    });

    router.push(`/qa/new?${searchParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="medium"
          className="h-12.5 rounded-xl px-6.5 font-normal"
          onClick={() => router.push(`/projects/${projectId}/edit`)}
        >
          수정
        </Button>
        <Button
          variant="outline"
          size="medium"
          className="h-12.5 rounded-xl px-6.5 font-normal"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          삭제
        </Button>
      </div>
      {!recruitableProject.hasActiveQa ? (
        <Button
          size="medium"
          className="h-12.5 rounded-xl font-normal"
          leftIcon={
            <span
              aria-hidden
              className="size-5 bg-gray-50 mask-[url(/icons/megaphone.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
          onClick={() => setIsRecruitDialogOpen(true)}
        >
          QA 모집 글 작성하기
        </Button>
      ) : null}

      <ProjectDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />

      <QaRecruitDialog
        open={isRecruitDialogOpen}
        projects={[recruitableProject]}
        onClose={() => setIsRecruitDialogOpen(false)}
        onSubmit={handleRecruitSubmit}
      />
    </div>
  );
}

export { ProjectActionBar };
