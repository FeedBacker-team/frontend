import { useMutation, useQuery } from '@tanstack/react-query';

import { createProject, getProjects } from '@/apis/project';
import type { ProjectListParams } from '@/types/project';

const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
};

function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params),
  });
}

function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
  });
}

export { projectKeys, useCreateProject, useProjects };
