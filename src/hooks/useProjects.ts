import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProjects } from '@/apis/project';
import {
  createProject,
  deleteProject,
  getMyProjects,
  getProjectDetail,
  updateProject,
} from '@/apis/projects';
import type { MyProjectResponse, ProjectUpdateRequest } from '@/apis/projects';
import { useAuthStore } from '@/stores/authStore';
import type { MyProjectItem } from '@/types/mypage';
import type { ProjectListParams } from '@/types/project';

const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (projectId: string) =>
    [...projectKeys.all, 'detail', projectId] as const,
  mine: () => [...projectKeys.all, 'me'] as const,
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function mapToMyProjectItem(response: MyProjectResponse): MyProjectItem {
  return {
    id: response.project_id,
    title: response.title,
    description: response.description,
    tags: response.tags,
    thumbnailUrl: response.thumbnail_image,
    publishedAt: formatDate(response.created_at),
    viewCount: response.view_count,
    hasActiveQa: response.has_active_qa,
    activeFeedbackPostId: response.active_feedback_post_id,
  };
}

function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: ({ signal }) => getProjects(params, signal),
  });
}

function useProjectDetail(projectId: string | undefined) {
  const authStatus = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ''),
    queryFn: ({ signal }) => {
      if (!projectId) {
        throw new Error('프로젝트 ID가 필요합니다');
      }

      return getProjectDetail(projectId, signal);
    },
    // 새로고침 직후에는 인증 세션이 초기화되기 전이라 is_owner가
    // 잘못된 값(false)으로 캐싱될 수 있어, 초기화가 끝난 뒤에 요청한다.
    enabled: Boolean(projectId) && authStatus !== 'initializing',
  });
}

function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
  });
}

function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: ProjectUpdateRequest;
    }) => updateProject(projectId, body),
    onSuccess: (_data, { projectId }) =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      }),
  });
}

function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

function useMyProjects() {
  return useQuery({
    queryKey: projectKeys.mine(),
    queryFn: async ({ signal }) => {
      const data = await getMyProjects(signal);
      return data.map(mapToMyProjectItem);
    },
  });
}

export {
  projectKeys,
  useCreateProject,
  useDeleteProject,
  useMyProjects,
  useProjectDetail,
  useProjects,
  useUpdateProject,
};
