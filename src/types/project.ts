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

type ProjectImageValue = Pick<File, 'name' | 'type' | 'size'>;

type ProjectFormValues = {
  title: string;
  description: string;
  tags: ProjectTag[];
  image: ProjectImageValue | null;
  url: string;
};

type ProjectFormErrors = Record<
  Exclude<keyof ProjectFormValues, 'tags'>,
  boolean
>;

export type {
  ProjectCard,
  ProjectFormErrors,
  ProjectFormValues,
  ProjectImageValue,
  ProjectListParams,
  ProjectListResponse,
  ProjectSort,
  ProjectTag,
};
