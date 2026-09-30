import type { ProjectTag } from '@/types/project';

import { projectRequest } from './request';

const PROJECTS_PATH = '/api/projects';

type ProjectCreateRequest = {
  title: string;
  description: string;
  tags?: ProjectTag[];
  serviceLink: string;
  thumbnailImage: string;
};

type ProjectCreateResponse = {
  project_id: string;
};

function getMockCreateProjectResponse(): ProjectCreateResponse {
  return { project_id: crypto.randomUUID() };
}

async function createProject(
  body: ProjectCreateRequest
): Promise<ProjectCreateResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockCreateProjectResponse();
  }

  return projectRequest<ProjectCreateResponse>(PROJECTS_PATH, {
    method: 'POST',
    json: body,
    fallbackMessage: '프로젝트 등록에 실패했습니다',
  });
}

export { createProject };
export type { ProjectCreateRequest, ProjectCreateResponse };
