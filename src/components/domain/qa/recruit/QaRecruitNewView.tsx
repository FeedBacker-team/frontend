'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { QaRecruitForm } from '@/components/domain/qa/recruit/QaRecruitForm';
import { useMyProjects } from '@/hooks/useProjects';
import { toQaRecruitableProject } from '@/lib/qa/recruitableProjects';
import type { QaTargetType } from '@/types/qa';

type QaRecruitNewViewProps = {
  projectId: string;
  target: QaTargetType;
};

function QaRecruitNewView({ projectId, target }: QaRecruitNewViewProps) {
  const router = useRouter();
  const projectsQuery = useMyProjects();
  const project = projectsQuery.data
    ?.map(toQaRecruitableProject)
    .find(
      (item) => item.projectId === projectId && !item.hasActiveQa
    );

  useEffect(() => {
    if (projectsQuery.isSuccess && !project) {
      router.replace('/qa');
    }
  }, [project, projectsQuery.isSuccess, router]);

  if (projectsQuery.isPending || (projectsQuery.isSuccess && !project)) {
    return (
      <div
        aria-label="QA 모집글 작성 화면 불러오는 중"
        className="mx-auto h-120 w-full max-w-220 animate-pulse rounded-2xl bg-gray-100"
      />
    );
  }

  if (projectsQuery.isError) {
    return (
      <section className="flex min-h-100 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 text-text-default">
            프로젝트 정보를 불러오지 못했습니다
          </h1>
          <p className="text-b2 text-text-sub">잠시 후 다시 시도해 주세요.</p>
        </div>
        <Button size="medium" onClick={() => void projectsQuery.refetch()}>
          다시 시도
        </Button>
      </section>
    );
  }

  if (!project) {
    return null;
  }

  return <QaRecruitForm project={project} target={target} />;
}

export { QaRecruitNewView };
