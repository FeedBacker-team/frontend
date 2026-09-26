import type { ProjectTag } from '@/types/project';

type QaRecruitmentStatus = 'RECRUITING' | 'CLOSED';

type QaTargetType = 'SERVICE_LINK' | 'IMAGE';

type QaSort = 'LATEST' | 'DEADLINE' | 'REWARD';

type QaRecruitmentListParams = {
  keyword?: string;
  tags?: ProjectTag[];
  sort?: QaSort;
  page?: number;
  size?: number;
};

type QaRecruitmentCard = {
  feedbackPostId: number;
  projectId: number;
  projectTitle: string;
  title: string;
  thumbnailUrl: string | null;
  tags: ProjectTag[];
  status: QaRecruitmentStatus;
  targetType: QaTargetType;
  startAt: string;
  endAt: string;
  capacity: number;
  participantCount: number;
  requiredAcorns: number;
  createdAt: string;
};

type QaRecruitmentListResponse = {
  totalCount: number;
  page: number;
  size: number;
  hasNext: boolean;
  feedbackPosts: QaRecruitmentCard[];
};

export type {
  QaRecruitmentCard,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaRecruitmentStatus,
  QaSort,
  QaTargetType,
};
