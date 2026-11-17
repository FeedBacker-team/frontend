import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProjects, getPublicProjectDetail } from '@/apis/project';
import { ProjectDetailView } from '@/components/domain/project/ProjectDetailView';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/constants/metadata';
import { RANKING_PROJECT_PAGE_SIZE } from '@/constants/project';
import { normalizeImageUrl } from '@/lib/image';
import {
  createDetailMetadata,
  createMetadataDescription,
  createMissingContentMetadata,
} from '@/lib/seo/metadata';
import { isUuid } from '@/lib/schemas/id';

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

async function getRankedProjects() {
  try {
    const [popular, webTrend] = await Promise.all([
      getProjects({ sort: 'VIEW_COUNT', page: 0, size: RANKING_PROJECT_PAGE_SIZE }),
      getProjects({
        sort: 'VIEW_COUNT',
        tags: ['WEB'],
        page: 0,
        size: RANKING_PROJECT_PAGE_SIZE,
      }),
    ]);

    return { popular, webTrend };
  } catch {
    return { popular: undefined, webTrend: undefined };
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
  const [project, { popular, webTrend }] = await Promise.all([
    getProject(projectId),
    getRankedProjects(),
  ]);

  if (project === null) {
    notFound();
  }

  const path = `/projects/${encodeURIComponent(projectId)}`;
  const structuredData = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}${path}#project`,
        name: project.title,
        description: createMetadataDescription(project.description),
        url: `${SITE_URL}${path}`,
        image: normalizeImageUrl(project.thumbnailUrl) ?? undefined,
        datePublished: project.createdAt,
        dateModified: project.updatedAt,
        author: {
          '@type': 'Person',
          name: project.ownerNickname,
        },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      }
    : null;

  const breadcrumbData = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Feedbacker',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: project.title,
            item: `${SITE_URL}${path}`,
          },
        ],
      }
    : null;

  return (
    <>
      {structuredData ? <JsonLd data={structuredData} /> : null}
      {breadcrumbData ? <JsonLd data={breadcrumbData} /> : null}
      <ProjectDetailView
        projectId={projectId}
        initialProject={project ?? undefined}
        initialPopular={popular}
        initialWebTrend={webTrend}
      />
    </>
  );
}
