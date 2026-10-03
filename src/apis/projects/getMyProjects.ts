import { projectRequest } from './request';

const MY_PROJECTS_PATH = '/api/users/me/projects';

type MyProjectResponse = {
  project_id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail_image: string | null;
  view_count: number;
  created_at: string;
  has_active_qa: boolean;
  active_feedback_post_id: string | null;
};

async function getMyProjects(
  signal?: AbortSignal
): Promise<MyProjectResponse[]> {
  return projectRequest<MyProjectResponse[]>(MY_PROJECTS_PATH, {
    method: 'GET',
    signal,
    fallbackMessage: '내 프로젝트 목록을 불러오지 못했습니다',
  });
}

export { getMyProjects };
export type { MyProjectResponse };
