import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPublicProjectDetail } from '@/apis/project';
import { getPublicQaRecruitmentDetail } from '@/apis/qaRecruitments';
import { QaDetail } from '@/components/domain/qa/detail/QaDetail';
import { normalizeImageUrl } from '@/lib/image';
import { isUuid } from '@/lib/schemas/id';
import {
  createDetailMetadata,
  createMissingContentMetadata,
} from '@/lib/seo/metadata';

async function getQa(qaId: string) {
  if (!isUuid(qaId)) {
    return null;
  }

  try {
    return await getPublicQaRecruitmentDetail(qaId);
  } catch {
    return undefined;
  }
}

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
  props: PageProps<'/qa/[qaId]'>
): Promise<Metadata> {
  const { qaId } = await props.params;
  const qa = await getQa(qaId);

  if (qa === null) {
    return createMissingContentMetadata('QA 모집글을 찾을 수 없습니다');
  }

  if (!qa) {
    return {};
  }

  let projectThumbnailUrl: string | null = null;

  const project = await getProject(qa.projectId);
  projectThumbnailUrl = normalizeImageUrl(project?.thumbnailUrl);

  const qaImageUrl = normalizeImageUrl(
    qa.images[0]?.url,
    projectThumbnailUrl
  );

  return createDetailMetadata({
    title: qa.title,
    description: qa.description,
    path: `/qa/${encodeURIComponent(qaId)}`,
    imageUrl: qaImageUrl || projectThumbnailUrl,
    shouldIndex: qa.status === 'RECRUITING',
  });
}

export default async function QaDetailPage(props: PageProps<'/qa/[qaId]'>) {
  const { qaId } = await props.params;
  const qa = await getQa(qaId);

  if (qa === null) {
    notFound();
  }

  const project = qa ? await getProject(qa.projectId) : undefined;

  const searchParams = await props.searchParams;
  const created = Array.isArray(searchParams.created)
    ? searchParams.created[0]
    : searchParams.created;

  return (
    <QaDetail
      feedbackPostId={qaId}
      showCreatedToast={created === '1'}
      initialQa={qa ?? undefined}
      initialProject={project ?? undefined}
    />
  );
}
