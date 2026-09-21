import { useQuery } from '@tanstack/react-query';

import { getProjects } from '@/apis/project';
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

export { projectKeys, useProjects };
