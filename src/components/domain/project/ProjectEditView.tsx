'use client';

import { Button } from '@/components/common/Button';
import { ProjectRegisterForm } from '@/components/domain/project/ProjectRegisterForm';
import { useProjectDetail } from '@/hooks/useProjects';
import { extractImagePathFromUrl } from '@/lib/image';
import type { ProjectFormValues, ProjectImageValue } from '@/types/project';

type ProjectEditViewProps = {
  projectId: string;
};

function buildImageValueFromUrl(url: string): ProjectImageValue {
  const pathname = url.split('?')[0];
  const fileName = decodeURIComponent(
    pathname.split('/').pop() || '대표 이미지'
  );
  const extension = fileName.split('.').pop()?.toLowerCase();
  const type =
    extension === 'jpg' || extension === 'jpeg'
      ? 'image/jpeg'
      : extension === 'gif'
        ? 'image/gif'
        : extension === 'webp'
          ? 'image/webp'
          : 'image/png';

  return { name: fileName, type, size: 0 };
}

function ProjectEditLoading() {
  return (
    <div
      className="h-160 w-full animate-pulse rounded-2xl bg-gray-100"
      aria-label="프로젝트 정보 불러오는 중"
    />
  );
}

type ProjectEditErrorProps = {
  message: string;
  onRetry: () => void;
};

function ProjectEditError({ message, onRetry }: ProjectEditErrorProps) {
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

function ProjectEditView({ projectId }: ProjectEditViewProps) {
  const projectQuery = useProjectDetail(projectId);

  if (projectQuery.isPending) {
    return <ProjectEditLoading />;
  }

  if (projectQuery.isError) {
    return (
      <ProjectEditError
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

  const initialValues: ProjectFormValues = {
    title: project.title,
    description: project.description,
    tags: project.tags,
    image: buildImageValueFromUrl(project.thumbnailUrl),
    imagePath: extractImagePathFromUrl(project.thumbnailUrl),
    url: project.serviceUrl,
  };

  return (
    <ProjectRegisterForm
      mode="edit"
      projectId={projectId}
      initialValues={initialValues}
    />
  );
}

export { ProjectEditView };
