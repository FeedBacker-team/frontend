import type { badgeVariants } from '@/components/common/Badge';
import type {
  AcornTransactionItem,
  MyProjectItem,
  MyQaParticipationItem,
  MyQaParticipationStatus,
  MyQaRecruitItem,
  TreeStageInfo,
  WithdrawReasonValue,
} from '@/types/mypage';

type BadgeVariant = NonNullable<Parameters<typeof badgeVariants>[0]>['variant'];

/** 이 값 이하로 남으면 D-day 뱃지를 rust로, 초과면 green으로 표시 */
const QA_URGENT_DAYS_LEFT_THRESHOLD = 3;

const ACORN_TRANSACTIONS_PAGE_SIZE = 5;

const MY_QA_PARTICIPATION_STATUS_LABEL: Record<
  MyQaParticipationStatus,
  string
> = {
  DISPUTE_REVIEWING: '이의제기 검토 중',
  DISPUTE_RESOLVED: '이의제기 검토 완료',
  BEFORE_SUBMIT: '제출 전',
  PENDING_REVIEW: '검토 대기 중',
  ACCEPTED: '수락',
  REJECTED: '거절',
  NOT_SUBMITTED: '미제출',
};

const MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT: Record<
  MyQaParticipationStatus,
  BadgeVariant
> = {
  DISPUTE_REVIEWING: 'default',
  DISPUTE_RESOLVED: 'default',
  BEFORE_SUBMIT: 'rust',
  PENDING_REVIEW: 'rust',
  ACCEPTED: 'green',
  REJECTED: 'default',
  NOT_SUBMITTED: 'default',
};

const MOCK_MY_PROJECT_TAGS = ['웹', 'B2B', 'AI · ML'];

const MOCK_MY_PROJECTS: MyProjectItem[] = Array.from(
  { length: 4 },
  (_, index) => ({
    id: String(index + 1),
    title: '프로젝트 제목',
    description: '프로젝트 설명',
    tags: MOCK_MY_PROJECT_TAGS,
    publishedAt: '2026-09-09',
    viewCount: 128,
  })
);

const MOCK_MY_QA_RECRUITS: MyQaRecruitItem[] = [
  {
    id: '1',
    title: 'QA 제목',
    tags: MOCK_MY_PROJECT_TAGS,
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '링크형',
    daysLeft: 28,
    rewardAcorn: 60,
    recruitedCount: 3,
    capacity: 5,
  },
  {
    id: '2',
    title: 'QA 제목',
    tags: MOCK_MY_PROJECT_TAGS,
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: 4,
    rewardAcorn: 60,
    recruitedCount: 3,
    capacity: 5,
  },
  {
    id: '3',
    title: 'QA 제목',
    tags: MOCK_MY_PROJECT_TAGS,
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
    recruitedCount: 5,
    capacity: 5,
  },
  {
    id: '4',
    title: 'QA 제목',
    tags: MOCK_MY_PROJECT_TAGS,
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
    recruitedCount: 5,
    capacity: 5,
  },
];

const MOCK_MY_QA_PARTICIPATIONS: MyQaParticipationItem[] = [
  {
    id: '1',
    title: 'QA 제목',
    status: 'DISPUTE_REVIEWING',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
  },
  {
    id: '2',
    title: 'QA 제목',
    status: 'DISPUTE_RESOLVED',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
  },
  {
    id: '3',
    title: 'QA 제목',
    status: 'BEFORE_SUBMIT',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '링크형',
    daysLeft: 28,
    rewardAcorn: 60,
  },
  {
    id: '4',
    title: 'QA 제목',
    status: 'PENDING_REVIEW',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '링크형',
    daysLeft: 28,
    rewardAcorn: 60,
  },
  {
    id: '5',
    title: 'QA 제목',
    status: 'ACCEPTED',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
  },
  {
    id: '6',
    title: 'QA 제목',
    status: 'REJECTED',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    daysLeft: null,
    rewardAcorn: 60,
  },
  {
    id: '7',
    title: 'QA 제목',
    status: 'NOT_SUBMITTED',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '링크형',
    daysLeft: null,
    rewardAcorn: 60,
  },
];

const MOCK_ACORN_TRANSACTION_TEMPLATES: Omit<AcornTransactionItem, 'id'>[] = [
  { title: '피드백 수락 보상', date: '2026-09-12', amount: 70 },
  { title: 'QA 모집', date: '2026-09-12', amount: -70 },
  { title: '피드백 수락 보상', date: '2026-09-12', amount: 70 },
  { title: '피드백 수락 보상', date: '2026-09-12', amount: 70 },
  { title: '가입 보상', date: '2026-09-12', amount: 70 },
];

const MOCK_ACORN_TRANSACTIONS: AcornTransactionItem[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: String(index + 1),
    ...MOCK_ACORN_TRANSACTION_TEMPLATES[
      index % MOCK_ACORN_TRANSACTION_TEMPLATES.length
    ],
  })
);

const TREE_STAGES: TreeStageInfo[] = [
  {
    stage: 1,
    stageLabel: '마른 나무',
    treeImageSrc: '/images/1st_tree.svg',
    humidityRangeLabel: '20% 미만',
    minHumidity: 0,
  },
  {
    stage: 2,
    stageLabel: '보통 나무',
    treeImageSrc: '/images/2nd_tree.svg',
    humidityRangeLabel: '20 ~ 44%',
    minHumidity: 20,
  },
  {
    stage: 3,
    stageLabel: '도토리 나무',
    treeImageSrc: '/images/3rd_tree.svg',
    humidityRangeLabel: '45 ~ 59%',
    minHumidity: 45,
  },
  {
    stage: 4,
    stageLabel: '풍성한 도토리 나무',
    treeImageSrc: '/images/4th_tree.svg',
    humidityRangeLabel: '60% 이상',
    minHumidity: 60,
  },
];

function getTreeStageByHumidity(humidity: number): TreeStageInfo {
  return (
    [...TREE_STAGES]
      .reverse()
      .find((treeStage) => humidity >= treeStage.minHumidity) ?? TREE_STAGES[0]
  );
}

const WITHDRAW_NOTICES: string[] = [
  '계정 정보, QA 참여 기록, 도토리 및 습도가 모두 삭제되며 복구할 수 없습니다.',
  '작성하신 피드백 및 게시글은 탈퇴 후에도 삭제되지 않습니다.',
  '탈퇴 후 동일 계정으로 30일간 재가입이 제한됩니다.',
];

const WITHDRAW_REASONS: { value: WithdrawReasonValue; label: string }[] = [
  { value: 'INCONVENIENT', label: '이용이 불편하고 잦은 오류가 발생해서' },
  { value: 'LACK_OF_QA', label: '참여하고 싶은 QA 프로젝트가 부족해서' },
  {
    value: 'STRICT_REVIEW',
    label: '피드백 검토 기준이 까다롭거나 거절이 잦아서',
  },
  { value: 'LOW_REWARD', label: '참여 노력 대비 보상(도토리)이 아쉬워서' },
  {
    value: 'NO_LONGER_USING',
    label: '더 이상 QA 참여나 프로젝트 등록을 하지 않아서',
  },
  { value: 'ETC', label: '기타:' },
];

export {
  ACORN_TRANSACTIONS_PAGE_SIZE,
  getTreeStageByHumidity,
  MOCK_ACORN_TRANSACTIONS,
  MOCK_MY_PROJECTS,
  MOCK_MY_QA_PARTICIPATIONS,
  MOCK_MY_QA_RECRUITS,
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
  TREE_STAGES,
  WITHDRAW_NOTICES,
  WITHDRAW_REASONS,
};
