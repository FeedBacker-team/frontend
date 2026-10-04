import type { QaRecruitmentStatus } from '@/types/qa';

type MyProjectItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string | null;
  publishedAt: string;
  viewCount: number;
  hasActiveQa: boolean;
  activeFeedbackPostId: string | null;
};

type QaContentType = '이미지형' | '링크형';

type MyQaRecruitItem = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  tags: string[];
  startDate: string;
  endDate: string;
  contentType: QaContentType;
  /** 모집이 끝났으면 null */
  daysLeft: number | null;
  rewardAcorn: number;
  recruitedCount: number;
  capacity: number;
};

type MyQaParticipationStatus =
  | 'DISPUTE_REVIEWING'
  | 'DISPUTE_RESOLVED'
  | 'BEFORE_SUBMIT'
  | 'PENDING_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'NOT_SUBMITTED';

type MyQaParticipationItem = {
  id: string;
  feedbackPostId: string;
  title: string;
  thumbnailUrl: string | null;
  status: MyQaParticipationStatus;
  startDate: string;
  endDate: string;
  contentType: QaContentType;
  /** 모집이 끝났으면 null */
  daysLeft: number | null;
  /** 피드백이 처리 완료된 날짜. 아직 처리되지 않았으면 null */
  completeDate: string | null;
  rewardAcorn: number;
};

type QaFeedbackQuestionBase = {
  id: string;
  order: number;
  required: boolean;
  question: string;
};

type QaFeedbackSingleChoiceQuestion = QaFeedbackQuestionBase & {
  type: 'SINGLE_CHOICE';
  options: string[];
  selectedOption: string;
};

type QaFeedbackMultipleChoiceQuestion = QaFeedbackQuestionBase & {
  type: 'MULTIPLE_CHOICE';
  options: string[];
  selectedOptions: string[];
};

type QaFeedbackTextQuestion = QaFeedbackQuestionBase & {
  type: 'TEXT';
  answer: string;
  /** 주관식 질문에 첨부 허용된 이미지가 있을 때만 존재 */
  images?: string[];
};

type QaFeedbackQuestion =
  | QaFeedbackSingleChoiceQuestion
  | QaFeedbackMultipleChoiceQuestion
  | QaFeedbackTextQuestion;

type QaRejectReason = {
  title: string;
  description: string;
};

type ObjectionResolutionResult = 'ACCEPTED' | 'REJECTED';

type MyQaObjection = {
  /** 이의제기 접수일 (YYYY-MM-DD) */
  submittedAt: string;
  reason: ObjectionReasonValue;
  detailReason: string;
  /** status가 DISPUTE_RESOLVED일 때만 존재 */
  resolution?: {
    result: ObjectionResolutionResult;
    /** 운영팀 검토 의견 */
    opinion: string;
  };
};

/**
 * 이의제기 작성 화면(/mypage/objection/[feedbackId])은 feedbackPostId를 모르는 채로
 * 이 타입을 쓰므로, 목록 전용 필드인 feedbackPostId는 상세에서는 선택값으로 둔다.
 */
type MyQaParticipationDetail = Omit<MyQaParticipationItem, 'feedbackPostId'> & {
  feedbackPostId?: string;
  participatedAt: string;
  submittedAt: string;
  feedbackQuestions: QaFeedbackQuestion[];
  /** status가 REJECTED / DISPUTE_REVIEWING / DISPUTE_RESOLVED일 때만 존재 */
  rejectReason?: QaRejectReason;
  /** status가 DISPUTE_REVIEWING / DISPUTE_RESOLVED일 때만 존재 */
  objection?: MyQaObjection;
};

type AcornTransactionItem = {
  id: string;
  title: string;
  date: string;
  /** 음수면 차감, 양수면 적립 */
  amount: number;
};

type WithdrawReasonValue =
  | 'INCONVENIENT'
  | 'LACK_OF_QA'
  | 'STRICT_REVIEW'
  | 'LOW_REWARD'
  | 'NO_LONGER_USING'
  | 'ETC';

type ObjectionReasonValue =
  'SINCERELY_WRITTEN' | 'REASON_MISMATCH' | 'PROJECT_ISSUE' | 'ETC';

/** 이의제기 사유 백엔드 enum */
type ObjectType =
  | 'FAITHFUUL_ANSWER'
  | 'REJECT_REASON_MISMATCH'
  | 'QA_PROJECT_ISSUE'
  | 'OTHER';

type MyQaFeedbackReviewStatus = Extract<
  MyQaParticipationStatus,
  'PENDING_REVIEW' | 'ACCEPTED' | 'REJECTED'
>;

type MyQaFeedbackReviewItem = {
  id: string;
  reviewerNickname: string;
  reviewerProfileImageUrl: string | null;
  status: MyQaFeedbackReviewStatus;
  submittedAt: string;
  /** status가 PENDING_REVIEW일 때만 존재 */
  responseDeadlineHoursLeft?: number;
};

type MyQaFeedbackReviewFilter = 'ALL' | MyQaFeedbackReviewStatus;

type MyQaRecruitDetail = MyQaRecruitItem & {
  status: QaRecruitmentStatus;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  usedAcorn: number;
  feedbackReviews: MyQaFeedbackReviewItem[];
};

type MyQaFeedbackReviewDetail = MyQaFeedbackReviewItem & {
  feedbackPostId: string;
  contentType: QaContentType;
  feedbackQuestions: QaFeedbackQuestion[];
};

type QaResultChoiceOptionStat = {
  option: string;
  count: number;
  percent: number;
};

type QaResultQuestionBase = {
  id: string;
  order: number;
  required: boolean;
  question: string;
  responseCount: number;
};

type QaResultSingleChoiceQuestion = QaResultQuestionBase & {
  type: 'SINGLE_CHOICE';
  optionStats: QaResultChoiceOptionStat[];
};

type QaResultMultipleChoiceQuestion = QaResultQuestionBase & {
  type: 'MULTIPLE_CHOICE';
  optionStats: QaResultChoiceOptionStat[];
};

type QaResultTextQuestion = QaResultQuestionBase & {
  type: 'TEXT';
  answers: string[];
};

type QaResultQuestion =
  | QaResultSingleChoiceQuestion
  | QaResultMultipleChoiceQuestion
  | QaResultTextQuestion;

type MyQaResultTesterAnswer = {
  id: string;
  reviewerNickname: string;
  reviewerProfileImageUrl: string | null;
  submittedAt: string;
  feedbackQuestions: QaFeedbackQuestion[];
};

type MyQaResultDetail = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  tags: string[];
  authorNickname: string;
  authorProfileImageUrl: string | null;
  startDate: string;
  endDate: string;
  contentType: QaContentType;
  rewardAcorn: number;
  /** contentType이 '링크형'일 때만 존재 */
  reviewUrl?: string;
  /** contentType이 '이미지형'일 때만 존재 */
  reviewImages?: string[];
  /** 이번 QA 진행 전 보유하고 있던 도토리 */
  totalAcorn: number;
  usedAcorn: number;
  questionStats: QaResultQuestion[];
  testerAnswers: MyQaResultTesterAnswer[];
};

type FeedbackRejectReasonValue =
  | 'IRRELEVANT_ANSWER'
  | 'LOW_EFFORT_ANSWER'
  | 'TEST_NOT_PERFORMED'
  | 'OTHER';

type MyPageTab = 'PROJECT' | 'QA_RECRUIT' | 'QA_PARTICIPATION';

type TreeStageInfo = {
  stage: number;
  stageLabel: string;
  treeImageSrc: string;
  humidityRangeLabel: string;
  /** 이 습도(%) 이상이면 해당 단계 */
  minHumidity: number;
};

export type {
  AcornTransactionItem,
  FeedbackRejectReasonValue,
  MyPageTab,
  MyProjectItem,
  MyQaFeedbackReviewDetail,
  MyQaFeedbackReviewFilter,
  MyQaFeedbackReviewItem,
  MyQaFeedbackReviewStatus,
  MyQaObjection,
  MyQaParticipationDetail,
  MyQaParticipationItem,
  MyQaParticipationStatus,
  MyQaRecruitDetail,
  MyQaRecruitItem,
  MyQaResultDetail,
  MyQaResultTesterAnswer,
  ObjectionReasonValue,
  ObjectionResolutionResult,
  ObjectType,
  QaContentType,
  QaFeedbackMultipleChoiceQuestion,
  QaFeedbackQuestion,
  QaFeedbackSingleChoiceQuestion,
  QaFeedbackTextQuestion,
  QaRejectReason,
  QaResultChoiceOptionStat,
  QaResultMultipleChoiceQuestion,
  QaResultQuestion,
  QaResultSingleChoiceQuestion,
  QaResultTextQuestion,
  TreeStageInfo,
  WithdrawReasonValue,
};
