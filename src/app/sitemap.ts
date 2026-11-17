import type { MetadataRoute } from 'next';

import { getProjects } from '@/apis/project';
import { getQaRecruitments } from '@/apis/qaRecruitments';
import { SITE_URL } from '@/constants/metadata';

const SITEMAP_PAGE_SIZE = 50;
const SITEMAP_REQUEST_TIMEOUT_MS = 10_000;

// 메타데이터 라우트의 기본 캐시를 사용하지 않고,
// 프로젝트의 생성·삭제 내역을 요청 시점에 반영한다.
export const dynamic = 'force-dynamic';

async function getProjectEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await getProjects({
      sort: 'LATEST',
      page,
      size: SITEMAP_PAGE_SIZE,
    }, AbortSignal.timeout(SITEMAP_REQUEST_TIMEOUT_MS));

    entries.push(
      ...response.projects.map((project) => ({
        url: `${SITE_URL}/projects/${encodeURIComponent(project.project_id)}`,
        lastModified: project.created_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );

    hasNext = response.has_next && response.projects.length > 0;
    page += 1;
  }

  return entries;
}

async function getQaListLastModified(): Promise<string | undefined> {
  const response = await getQaRecruitments(
    { sort: 'LATEST', page: 0, size: 1 },
    AbortSignal.timeout(SITEMAP_REQUEST_TIMEOUT_MS)
  );

  return response.feedbackPosts[0]?.startAt;
}

function getUniqueEntries(entries: MetadataRoute.Sitemap) {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return [
      { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_URL}/qa`, changeFrequency: 'daily', priority: 0.9 },
    ];
  }

  const [projectEntries, qaListLastModified] = await Promise.all([
    getProjectEntries().catch(() => []),
    getQaListLastModified().catch(() => undefined),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: projectEntries[0]?.lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/qa`,
      lastModified: qaListLastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return getUniqueEntries([...staticEntries, ...projectEntries]);
}
