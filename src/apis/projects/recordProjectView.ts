import { projectRequest } from './request';

type ProjectViewResponse = {
  view_count: number;
};

function buildProjectViewsPath(projectId: string) {
  return `/api/projects/${encodeURIComponent(projectId)}/views`;
}

async function recordProjectView(projectId: string): Promise<number> {
  const response = await projectRequest<ProjectViewResponse>(
    buildProjectViewsPath(projectId),
    {
      method: 'POST',
      fallbackMessage: '조회수를 기록하지 못했습니다',
    }
  );

  return response.view_count;
}

export { recordProjectView };
