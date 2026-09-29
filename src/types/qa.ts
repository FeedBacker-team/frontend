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

type QaRecruitImageType = 'POST_THUMBNAIL';

type QaRecruitImageRequest = {
  type: QaRecruitImageType;
  order: number;
  path: string;
};

type QaRecruitChoiceQuestionRequest = {
  order: number;
  questionText: string;
  optionText: string[];
  maxSelectionCount: number;
  images?: QaRecruitImageRequest[];
  isRequire: boolean;
};

type QaRecruitSubjectiveQuestionRequest = {
  order: number;
  questionText: string;
  images?: QaRecruitImageRequest[];
  isRequire: boolean;
  minimumLength?: number;
};

type CreateQaRecruitmentRequest = {
  projectId: string;
  title: string;
  description: string;
  slotCapacity: number;
  depositAcorn: number;
  rewardAcorn: number;
  startAt: string;
  endAt: string;
  target: QaTargetType;
  tags?: ProjectTag[];
  serviceUrl: string;
  images?: QaRecruitImageRequest[];
  choiceQuestions?: QaRecruitChoiceQuestionRequest[];
  subjectiveQuestions?: QaRecruitSubjectiveQuestionRequest[];
};

type CreateQaRecruitmentResponse = {
  feedbackPostId: string;
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

type QaImageType = 'POST_THUMBNAIL';

type ImageResponse = {
  type: QaImageType;
  order: number;
  url: string;
};

type QuestionConfigResponse = {
  totalQuestionCount: number;
  choiceQuestionCount: number;
  subjectiveQuestionCount: number;
  estimatedTime: number;
};

type QaRecruitmentDetailResponse = {
  feedbackPostId: string;
  projectId: string;
  title: string;
  description: string;
  status: QaRecruitmentStatus;
  targetType: QaTargetType;
  serviceUrl: string | null;
  images: ImageResponse[];
  slotCapacity: number;
  remainSlotCount: number;
  completedParticipantCount: number;
  depositAcorn: number;
  rewardAcorn: number;
  startAt: string;
  endAt: string;
  expireAt: string | null;
  tags: ProjectTag[];
  questionConfig: QuestionConfigResponse;
};

type QaFeedbackChoiceQuestionResponse = {
  order: number;
  questionText: string;
  optionText: string[];
  maxSelectionCount: number;
  images: ImageResponse[];
  isRequire: boolean;
};

type QaFeedbackSubjectiveQuestionResponse = {
  order: number;
  questionText: string;
  images: ImageResponse[];
  isRequire: boolean;
  minimumLength: number | null;
};

type QaFeedbackFormResponse = {
  choiceQuestionResponses: QaFeedbackChoiceQuestionResponse[];
  subjectiveQuestionResponses: QaFeedbackSubjectiveQuestionResponse[];
};

type QaFeedbackSingleChoiceQuestion = QaFeedbackChoiceQuestionResponse & {
  type: 'SINGLE_CHOICE';
};

type QaFeedbackMultipleChoiceQuestion = QaFeedbackChoiceQuestionResponse & {
  type: 'MULTIPLE_CHOICE';
};

type QaFeedbackSubjectiveQuestion = QaFeedbackSubjectiveQuestionResponse & {
  type: 'SUBJECTIVE';
};

type QaFeedbackQuestion =
  | QaFeedbackSingleChoiceQuestion
  | QaFeedbackMultipleChoiceQuestion
  | QaFeedbackSubjectiveQuestion;

type QaFeedbackAnswerFormValue = {
  selectedOptions: number[];
  text: string;
};

type QaFeedbackFormValues = {
  answers: Record<string, QaFeedbackAnswerFormValue>;
};

type QaFeedbackChoiceAnswerRequest = {
  order: number;
  selectedOption: number[] | null;
  images: QaRecruitImageRequest[];
};

type QaFeedbackSubjectiveAnswerRequest = {
  order: number;
  text: string;
};

type SubmitQaFeedbackRequest = {
  feedbackPostId: string;
  questionAnswer: {
    choiceAnswers: QaFeedbackChoiceAnswerRequest[];
    subjectiveAnswers: QaFeedbackSubjectiveAnswerRequest[];
  };
};

type SubmitQaFeedbackResponse = {
  feedbackId: string;
};

class QaApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'QaApiError';
    this.status = status;
  }
}

export { QaApiError };
export type {
  ActiveQaSummary,
  CreateQaRecruitmentRequest,
  CreateQaRecruitmentResponse,
  ImageResponse,
  QuestionConfigResponse,
  QaFeedbackChoiceQuestionResponse,
  QaFeedbackAnswerFormValue,
  QaFeedbackChoiceAnswerRequest,
  QaFeedbackFormResponse,
  QaFeedbackFormValues,
  QaFeedbackMultipleChoiceQuestion,
  QaFeedbackQuestion,
  QaFeedbackSingleChoiceQuestion,
  QaFeedbackSubjectiveQuestion,
  QaFeedbackSubjectiveAnswerRequest,
  QaFeedbackSubjectiveQuestionResponse,
  QaRecruitableProject,
  QaRecruitChoiceQuestionRequest,
  QaRecruitChoiceQuestionFormValue,
  QaRecruitDialogState,
  QaRecruitFormStep,
  QaRecruitFormValues,
  QaImageType,
  QaRecruitQuestionFormValue,
  QaRecruitImageRequest,
  QaRecruitImageType,
  QaRecruitmentCard,
  QaRecruitmentDetailResponse,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaRecruitmentStatus,
  QaRecruitStep,
  QaRecruitSubjectiveQuestionRequest,
  QaRecruitSubjectiveQuestionFormValue,
  QaSort,
  QaTargetType,
  SubmitQaFeedbackRequest,
  SubmitQaFeedbackResponse,
};
