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

function getMockMyProjects(): MyProjectResponse[] {
  return [
    {
      project_id: '59f43493-8d9c-4c47-9ab2-83e27ca261cc',
      title: '피드배커 온보딩 리디자인',
      description: '온보딩 흐름의 사용성을 개선하는 프로젝트입니다.',
      tags: ['WEB', 'UX'],
      thumbnail_image: null,
      view_count: 128,
      created_at: '2026-09-20T14:30:00',
      has_active_qa: true,
      active_feedback_post_id: '75c85de0-247d-4667-a031-06fed37e57f0',
    },
    {
      project_id: '9793779f-3bc8-45cc-b694-ef249f548045',
      title: '도토리 QA 대시보드',
      description: 'QA 참여 현황을 관리하는 대시보드입니다.',
      tags: ['WEB', 'B2B'],
      thumbnail_image: null,
      view_count: 42,
      created_at: '2026-09-18T10:00:00',
      has_active_qa: false,
      active_feedback_post_id: null,
    },
  ];
}

async function getMyProjects(
  signal?: AbortSignal
): Promise<MyProjectResponse[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockMyProjects();
  }

  return projectRequest<MyProjectResponse[]>(MY_PROJECTS_PATH, {
    method: 'GET',
    signal,
    fallbackMessage: '내 프로젝트 목록을 불러오지 못했습니다',
  });
}

export { getMyProjects };
export type { MyProjectResponse };
