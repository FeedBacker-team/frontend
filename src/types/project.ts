type ProjectTag =
  | 'WEB'
  | 'APP'
  | 'AI_ML'
  | 'DATA'
  | 'CLOUD'
  | 'COMMERCE'
  | 'FINTECH'
  | 'B2B_SAAS'
  | 'CONTENT_MEDIA'
  | 'GAME'
  | 'UXUI'
  | 'SECURITY'
  | 'PRODUCTIVITY'
  | 'HEALTHCARE'
  | 'GLOBAL';

type ProjectSort = 'LATEST' | 'VIEW_COUNT';

type ProjectListParams = {
  keyword?: string;
  tags?: ProjectTag[];
  sort?: ProjectSort;
  page?: number;
  size?: number;
};

type ProjectCard = {
  project_id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  tags: ProjectTag[];
  created_at: string;
  view_count: number;
};

type ProjectListResponse = {
  total_count: number;
  page: number;
  size: number;
  has_next: boolean;
  projects: ProjectCard[];
};

export type {
  ProjectCard,
  ProjectListParams,
  ProjectListResponse,
  ProjectSort,
  ProjectTag,
};
