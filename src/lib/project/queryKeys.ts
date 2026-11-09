import type { ProjectListParams } from '@/types/project';

const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (projectId: string) =>
    [...projectKeys.all, 'detail', projectId] as const,
  mine: () => [...projectKeys.all, 'me'] as const,
};

export { projectKeys };
