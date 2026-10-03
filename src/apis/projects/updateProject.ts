import type { ProjectTag } from '@/types/project';

import { projectRequest } from './request';

function buildProjectPath(projectId: string) {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

type ProjectUpdateRequest = {
  title: string;
  description: string;
  tags?: ProjectTag[];
  serviceLink: string;
  thumbnailImage: string;
};

async function updateProject(
  projectId: string,
  body: ProjectUpdateRequest
): Promise<void> {
  return projectRequest<void>(buildProjectPath(projectId), {
    method: 'PUT',
    json: body,
    responseType: 'void',
    fallbackMessage: '프로젝트 수정에 실패했습니다',
  });
}

export { updateProject };
export type { ProjectUpdateRequest };
