import { baseApiRequest } from '@/apis/baseClient';
import { ProjectError } from '@/apis/projects';
import { DEFAULT_PROJECT_PAGE_SIZE } from '@/constants/project';
import {
  type ProjectListParams,
  type ProjectListResponse,
  type ProjectSort,
  type ProjectTag,
} from '@/types/project';

const PROJECTS_PATH = '/api/projects';

type NormalizedProjectListParams = {
  keyword?: string;
  tags?: ProjectTag[];
  sort: ProjectSort;
  page: number;
  size: number;
};

function normalizeProjectListParams(
  params: ProjectListParams
): NormalizedProjectListParams {
  return {
    keyword: params.keyword?.trim() || undefined,
    tags: params.tags?.length ? params.tags : undefined,
    sort: params.sort ?? 'LATEST',
    page: params.page ?? 0,
    size: params.size ?? DEFAULT_PROJECT_PAGE_SIZE,
  };
}

function buildProjectListQuery(params: NormalizedProjectListParams) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }

  if (params.tags?.length) {
    searchParams.set('tags', params.tags.join(','));
  }

  searchParams.set('sort', params.sort);
  searchParams.set('page', String(params.page));
  searchParams.set('size', String(params.size));

  return searchParams.toString();
}

async function getProjects(
  params: ProjectListParams = {},
  signal?: AbortSignal
): Promise<ProjectListResponse> {
  const normalized = normalizeProjectListParams(params);
  const query = buildProjectListQuery(normalized);

  return baseApiRequest<ProjectListResponse>(`${PROJECTS_PATH}?${query}`, {
    method: 'GET',
    signal,
    errorFactory: (message, status) => new ProjectError(message, status),
    fallbackMessage: '프로젝트 목록을 불러오지 못했습니다',
  });
}

export { getProjects };
