import { projectRequest } from './request';

function buildProjectPath(projectId: string) {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

async function deleteProject(projectId: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return;
  }

  return projectRequest<void>(buildProjectPath(projectId), {
    method: 'DELETE',
    responseType: 'void',
    fallbackMessage: '프로젝트 삭제에 실패했습니다',
  });
}

export { deleteProject };
