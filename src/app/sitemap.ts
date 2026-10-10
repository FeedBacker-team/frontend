import type { MetadataRoute } from 'next';

import { getProjects } from '@/apis/project';
import { getQaRecruitments } from '@/apis/qaRecruitments';
import { SITE_URL } from '@/constants/metadata';

const SITEMAP_PAGE_SIZE = 50;
const SITEMAP_REQUEST_TIMEOUT_MS = 10_000;

const STATIC_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${SITE_URL}/qa`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
];

export const revalidate = 3600;

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
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );

    hasNext = response.has_next && response.projects.length > 0;
    page += 1;
  }

  return entries;
}

async function getQaEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await getQaRecruitments({
      sort: 'LATEST',
      page,
      size: SITEMAP_PAGE_SIZE,
    }, AbortSignal.timeout(SITEMAP_REQUEST_TIMEOUT_MS));

    entries.push(
      ...response.feedbackPosts.map((qa) => ({
        url: `${SITE_URL}/qa/${encodeURIComponent(qa.feedbackPostId)}`,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    );

    hasNext = response.hasNext && response.feedbackPosts.length > 0;
    page += 1;
  }

  return entries;
}

function getUniqueEntries(entries: MetadataRoute.Sitemap) {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return STATIC_ENTRIES;
  }

  const results = await Promise.allSettled([
    getProjectEntries(),
    getQaEntries(),
  ]);
  const dynamicEntries = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );

  return getUniqueEntries([...STATIC_ENTRIES, ...dynamicEntries]);
}
