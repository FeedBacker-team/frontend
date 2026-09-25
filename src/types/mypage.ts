type MyProjectItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  viewCount: number;
};

type QaContentType = '이미지형' | '링크형';

type MyQaRecruitItem = {
  id: string;
  title: string;
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
  title: string;
  status: MyQaParticipationStatus;
  startDate: string;
  endDate: string;
  contentType: QaContentType;
  /** 모집이 끝났으면 null */
  daysLeft: number | null;
  rewardAcorn: number;
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
  MyProjectItem,
  MyQaParticipationItem,
  MyQaParticipationStatus,
  MyQaRecruitItem,
  QaContentType,
  TreeStageInfo,
  WithdrawReasonValue,
};
