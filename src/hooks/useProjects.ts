import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createProject,
  getProjectDetail,
  getProjects,
} from '@/apis/project';
import type { ProjectListParams } from '@/types/project';

const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (projectId: string) =>
    [...projectKeys.all, 'detail', projectId] as const,
};

function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params),
  });
}

function useProjectDetail(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ''),
    queryFn: ({ signal }) => {
      if (!projectId) {
        throw new Error('프로젝트 ID가 필요합니다');
      }

      return getProjectDetail(projectId, signal);
    },
    enabled: Boolean(projectId),
  });
}

function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
  });
}

export { projectKeys, useCreateProject, useProjectDetail, useProjects };
