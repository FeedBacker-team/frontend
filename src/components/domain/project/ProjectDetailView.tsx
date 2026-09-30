'use client';

import { Button } from '@/components/common/Button';
import { HomeRankedProjects } from '@/components/domain/home/HomeRankedProjects';
import { ProjectDetail } from '@/components/domain/project/ProjectDetail';
import { PROJECT_TAG_LABEL } from '@/constants/project';
import { useProjectDetail } from '@/hooks/useProjects';

type ProjectDetailViewProps = {
  projectId: string;
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function ProjectDetailLoading() {
  return (
    <div
      className="flex animate-pulse gap-10"
      aria-label="프로젝트 상세 불러오는 중"
    >
      <div className="h-120 min-w-0 flex-1 rounded-2xl bg-gray-100" />
      <div className="h-80 w-80 shrink-0 rounded-2xl bg-gray-100" />
    </div>
  );
}

type ProjectDetailErrorProps = {
  message: string;
  onRetry: () => void;
};

function ProjectDetailError({ message, onRetry }: ProjectDetailErrorProps) {
  return (
    <section className="flex min-h-100 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-text-default">
          프로젝트 정보를 불러오지 못했습니다
        </h1>
        <p className="text-b2 text-text-sub">{message}</p>
      </div>
      <Button size="medium" onClick={onRetry}>
        다시 시도
      </Button>
    </section>
  );
}

function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const projectQuery = useProjectDetail(projectId);

  if (projectQuery.isPending) {
    return <ProjectDetailLoading />;
  }

  if (projectQuery.isError) {
    return (
      <ProjectDetailError
        message={
          projectQuery.error instanceof Error
            ? projectQuery.error.message
            : '잠시 후 다시 시도해 주세요.'
        }
        onRetry={() => void projectQuery.refetch()}
      />
    );
  }

  const project = projectQuery.data;

  if (!project) {
    return null;
  }

  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <ProjectDetail
          projectId={projectId}
          title={project.title}
          tags={project.tags.map((tag) => PROJECT_TAG_LABEL[tag])}
          thumbnailUrl={project.thumbnailUrl}
          authorNickname={project.ownerNickname}
          publishedAt={formatDate(project.createdAt)}
          viewCount={project.viewCount}
          url={project.serviceUrl}
          description={project.description}
          isOwner={project.isOwner}
          recruitingQa={
            project.hasActiveQa && project.activeQa
              ? {
                  title: project.activeQa.title,
                  slotCapacity: project.activeQa.slotCapacity,
                  endDate: formatDate(project.activeQa.endAt),
                  rewardAcorn: project.activeQa.rewardAcorn,
                }
              : undefined
          }
        />
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-14">
        <HomeRankedProjects />
      </aside>
    </div>
  );
}

export { ProjectDetailView };
