import type { ProjectTag } from '@/types/project';

type QaRecruitmentStatus = 'RECRUITING' | 'CLOSED';

type QaTargetType = 'SERVICE_LINK' | 'IMAGE';

type QaRecruitDialogState = 'IN_PROGRESS' | 'RECRUIT_STEP';

type QaRecruitStep = 'PROJECT_SELECT' | 'TEST_METHOD';

type QaRecruitFormStep = 'BASIC' | 'QUESTIONS' | 'SUBMITTING';

type QaRecruitChoiceQuestionFormValue = {
  clientId: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  questionText: string;
  options: string[];
  maxSelectionCount: number;
  isRequire: boolean;
  allowImageAttachment: boolean;
};

type QaRecruitSubjectiveQuestionFormValue = {
  clientId: string;
  type: 'SUBJECTIVE';
  questionText: string;
  minimumLength: number | null;
  isRequire: boolean;
  allowImageAttachment: boolean;
};

type QaRecruitQuestionFormValue =
  | QaRecruitChoiceQuestionFormValue
  | QaRecruitSubjectiveQuestionFormValue;

type QaRecruitFormValues = {
  projectId: string;
  target: QaTargetType;
  title: string;
  description: string;
  slotCapacity: number | undefined;
  endAt: string;
  serviceUrl: string;
  testImages: File[];
  questions: QaRecruitQuestionFormValue[];
};

type ActiveQaSummary = {
  feedbackPostId: number;
  title: string;
  thumbnailUrl: string | null;
  startAt: string;
  endAt: string;
};

type QaRecruitableProject = {
  projectId: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  hasActiveQa: boolean;
  activeQa: ActiveQaSummary | null;
};

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
  ActiveQaSummary,
  QaRecruitableProject,
  QaRecruitChoiceQuestionFormValue,
  QaRecruitDialogState,
  QaRecruitFormStep,
  QaRecruitFormValues,
  QaRecruitQuestionFormValue,
  QaRecruitmentCard,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaRecruitmentStatus,
  QaRecruitStep,
  QaRecruitSubjectiveQuestionFormValue,
  QaSort,
  QaTargetType,
};
