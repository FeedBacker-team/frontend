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
  | 'EDUCATION'
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

type ProjectCreateRequest = {
  title: string;
  description: string;
  tags: ProjectTag[];
  image_url: string;
  url: string;
};

type ProjectCreateResponse = {
  project_id: number;
};

class ProjectError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ProjectError';
    this.status = status;
  }
}

export { ProjectError };
export type {
  ProjectCard,
  ProjectCreateRequest,
  ProjectCreateResponse,
  ProjectFormValues,
  ProjectImageValue,
  ProjectListParams,
  ProjectListResponse,
  ProjectSort,
  ProjectTag,
};
