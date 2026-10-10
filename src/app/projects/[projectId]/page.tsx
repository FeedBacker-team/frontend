import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPublicProjectDetail } from '@/apis/project';
import { ProjectDetailView } from '@/components/domain/project/ProjectDetailView';
import { normalizeImageUrl } from '@/lib/image';
import { isUuid } from '@/lib/schemas/id';
import {
  createDetailMetadata,
  createMissingContentMetadata,
} from '@/lib/seo/metadata';

async function getProject(projectId: string) {
  if (!isUuid(projectId)) {
    return null;
  }

  try {
    return await getPublicProjectDetail(projectId);
  } catch {
    return undefined;
  }
}

export async function generateMetadata(
  props: PageProps<'/projects/[projectId]'>
): Promise<Metadata> {
  const { projectId } = await props.params;
  const project = await getProject(projectId);

  if (project === null) {
    return createMissingContentMetadata('프로젝트를 찾을 수 없습니다');
  }

  if (!project) {
    return {};
  }

  return createDetailMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${encodeURIComponent(projectId)}`,
    imageUrl: normalizeImageUrl(project.thumbnailUrl),
  });
}

export default async function ProjectDetailPage(
  props: PageProps<'/projects/[projectId]'>
) {
  const { projectId } = await props.params;
  const project = await getProject(projectId);

  if (project === null) {
    notFound();
  }

  return (
    <ProjectDetailView
      projectId={projectId}
      initialProject={project ?? undefined}
    />
  );
}
