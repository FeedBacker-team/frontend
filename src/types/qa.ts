import type { ProjectTag } from '@/types/project';

type QaRecruitmentStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED';

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

type QaImageType = 'POST' | 'POST_THUMBNAIL' | 'QUESTION' | 'ANSWER';

type QaRecruitImageType = QaImageType;

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
  allowImageAttachment: boolean;
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
  serviceUrl: string | null;
  images?: QaRecruitImageRequest[];
  choiceQuestions?: QaRecruitChoiceQuestionRequest[];
  subjectiveQuestions?: QaRecruitSubjectiveQuestionRequest[];
};

type CreateQaRecruitmentResponse = {
  feedbackPostId: string;
};

type ActiveQaSummary = {
  feedbackPostId: string;
  title?: string;
  thumbnailUrl?: string | null;
  startAt?: string;
  endAt?: string;
};

type QaRecruitableProject = {
  projectId: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  hasActiveQa: boolean;
  activeQa: ActiveQaSummary | null;
};

type QaSort = 'LATEST' | 'DEADLINE';

type QaRecruitmentListParams = {
  keyword?: string;
  tags?: ProjectTag[];
  sort?: QaSort;
  page?: number;
  size?: number;
};

type QaRecruitmentCard = {
  feedbackPostId: string;
  projectId: string;
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

type MyQaRecruitment = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  type: QaTargetType;
  status: QaRecruitmentStatus;
  rewardAcorn: number;
  slotCapacity: number;
  remainSlot: number;
  tags: ProjectTag[];
  thumbnailInfo: ImageResponse | null;
};

type MyQaParticipationStatus =
  | 'WRITING'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELED'
  | 'EXPIRED';

type MyQaParticipation = {
  id: string;
  title: string;
  status: MyQaParticipationStatus;
  rewardAcorn: number;
  rejectType: string | null;
  submitAt: string;
  processedAt: string | null;
  /**
   * 마이페이지 "내 QA 참여" 카드에 기간/콘텐츠 타입/D-day를 보여주려면 모집글 식별자가 필요하다.
   * 이 값이 생기면 이미 동작 중인 QA 모집글 상세 조회(getQaRecruitmentDetail)로
   * 해당 정보를 그대로 가져다 쓸 수 있어, 날짜 필드를 이 응답에 중복으로 추가하는
   * 대신 feedbackPostId만 추가해 달라고 백엔드에 요청할 예정. 아직 응답에 없을 수 있음.
   */
  feedbackPostId?: string;
};

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
  depositAcorn: number;
  rewardAcorn: number;
  startAt: string;
  endAt: string;
  myFeedbackStatus: MyQaParticipationStatus | null;
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
  allowImageAttachment?: boolean;
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

type QaFeedbackSubjectiveQuestion = Omit<
  QaFeedbackSubjectiveQuestionResponse,
  'allowImageAttachment'
> & {
  type: 'SUBJECTIVE';
  allowImageAttachment: boolean;
};

type QaFeedbackQuestion =
  | QaFeedbackSingleChoiceQuestion
  | QaFeedbackMultipleChoiceQuestion
  | QaFeedbackSubjectiveQuestion;

type QaFeedbackAnswerFormValue = {
  selectedOptions: number[];
  text: string;
  image: File | null;
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
  text: string | null;
  images: QaRecruitImageRequest[];
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
  MyQaParticipation,
  MyQaParticipationStatus,
  MyQaRecruitment,
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
