import type { QaRecruitmentStatus, QaTargetType } from '@/types/qa';

type ProjectTag =
  | 'WEB'
  | 'APP'
  | 'AI'
  | 'DATA'
  | 'CLOUD'
  | 'COMMERCE'
  | 'FINTECH'
  | 'B2B'
  | 'CONTENT_MEDIA'
  | 'GAME'
  | 'UX'
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

type ProjectActiveQaResponse = {
  feedback_post_id: string;
  title: string;
  status: QaRecruitmentStatus;
  target_type: QaTargetType;
  slot_capacity: number;
  remaining_slots: number;
  reward_acorn: number;
  end_at: string;
};

type ProjectDetailResponse = {
  project_id: string;
  title: string;
  description: string;
  tags: ProjectTag[];
  service_link: string;
  thumbnail_image: string;
  owner_id: string;
  owner_nickname: string;
  profile_image_path: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
  has_active_qa: boolean;
  active_qa: ProjectActiveQaResponse | null;
};

type ProjectActiveQa = {
  feedbackPostId: string;
  title: string;
  status: QaRecruitmentStatus;
  targetType: QaTargetType;
  slotCapacity: number;
  remainingSlots: number;
  rewardAcorn: number;
  endAt: string;
};

type ProjectDetail = {
  projectId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tags: ProjectTag[];
  serviceUrl: string;
  ownerId: string;
  ownerNickname: string;
  ownerProfileImageUrl: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  hasActiveQa: boolean;
  activeQa: ProjectActiveQa | null;
};

type ProjectImageValue = Pick<File, 'name' | 'type' | 'size'>;

type ProjectFormValues = {
  title: string;
  description: string;
  tags: ProjectTag[];
  image: ProjectImageValue | null;
  imagePath: string | null;
  url: string;
};

export type {
  ProjectActiveQa,
  ProjectActiveQaResponse,
  ProjectCard,
  ProjectDetail,
  ProjectDetailResponse,
  ProjectFormValues,
  ProjectImageValue,
  ProjectListParams,
  ProjectListResponse,
  ProjectSort,
  ProjectTag,
};
