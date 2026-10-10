import { baseApiRequest } from '@/apis/baseClient';
import { ProjectError } from '@/apis/projects/error';
import { DEFAULT_PROJECT_PAGE_SIZE } from '@/constants/project';
import { resolveImageUrl } from '@/lib/image';
import {
  type ProjectDetail,
  type ProjectDetailResponse,
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

async function getPublicProjectDetail(
  projectId: string
): Promise<ProjectDetail | null> {
  try {
    const response = await baseApiRequest<ProjectDetailResponse>(
      `${PROJECTS_PATH}/${encodeURIComponent(projectId)}`,
      {
        method: 'GET',
        next: { revalidate: 300 },
        errorFactory: (message, status) => new ProjectError(message, status),
        fallbackMessage: '프로젝트를 불러오지 못했습니다',
      }
    );

    return {
      projectId: response.project_id,
      title: response.title,
      description: response.description,
      thumbnailUrl: response.thumbnail_image,
      tags: response.tags,
      serviceUrl: response.service_link,
      ownerId: response.owner_id,
      ownerNickname: response.owner_nickname,
      ownerProfileImageUrl: response.profile_image_url
        ? response.profile_image_url
        : response.profile_image_path
          ? resolveImageUrl(
              response.profile_image_path,
              response.thumbnail_image
            )
          : null,
      viewCount: response.view_count,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      isOwner: false,
      hasActiveQa: response.has_active_qa,
      activeQa: response.active_qa
        ? {
            feedbackPostId: response.active_qa.feedback_post_id,
            title: response.active_qa.title,
            status: response.active_qa.status,
            targetType: response.active_qa.target_type,
            slotCapacity: response.active_qa.slot_capacity,
            remainingSlots: response.active_qa.remaining_slots,
            rewardAcorn: response.active_qa.reward_acorn,
            endAt: response.active_qa.end_at,
          }
        : null,
    };
  } catch (error) {
    if (error instanceof ProjectError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export { getProjects, getPublicProjectDetail };
