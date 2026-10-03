import { resolveImageUrl } from '@/lib/image';
import type { ProjectDetail, ProjectDetailResponse } from '@/types/project';

import { projectRequest } from './request';

function buildProjectPath(projectId: string) {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

function mapProjectDetailResponse(
  response: ProjectDetailResponse
): ProjectDetail {
  return {
    projectId: response.project_id,
    title: response.title,
    description: response.description,
    thumbnailUrl: response.thumbnail_image,
    tags: response.tags,
    serviceUrl: response.service_link,
    ownerId: response.owner_id,
    ownerNickname: response.owner_nickname,
    ownerProfileImageUrl: response.profile_image_path
      ? resolveImageUrl(response.profile_image_path, response.thumbnail_image)
      : null,
    viewCount: response.view_count,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    isOwner: response.is_owner,
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
}

async function getProjectDetail(
  projectId: string,
  signal?: AbortSignal
): Promise<ProjectDetail> {
  const response = await projectRequest<ProjectDetailResponse>(
    buildProjectPath(projectId),
    {
      method: 'GET',
      signal,
      fallbackMessage: (status) =>
        status === 404
          ? '프로젝트를 찾을 수 없습니다'
          : '프로젝트를 불러오지 못했습니다',
    }
  );

  return mapProjectDetailResponse(response);
}

export { getProjectDetail, mapProjectDetailResponse };
