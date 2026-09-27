import type { badgeVariants } from '@/components/common/Badge';
import type {
  AcornTransactionItem,
  FeedbackRejectReasonValue,
  MyPageTab,
  MyProjectItem,
  MyQaFeedbackReviewDetail,
  MyQaFeedbackReviewFilter,
  MyQaFeedbackReviewItem,
  MyQaFeedbackReviewStatus,
  MyQaParticipationDetail,
  MyQaParticipationItem,
  MyQaParticipationStatus,
  MyQaRecruitDetail,
  MyQaRecruitItem,
  MyQaResultDetail,
  MyQaResultTesterAnswer,
  ObjectionReasonValue,
  QaFeedbackQuestion,
  QaResultQuestion,
  TreeStageInfo,
  WithdrawReasonValue,
} from '@/types/mypage';

type BadgeVariant = NonNullable<Parameters<typeof badgeVariants>[0]>['variant'];

/** 이 값 이하로 남으면 D-day 뱃지를 rust로, 초과면 green으로 표시 */
const QA_URGENT_DAYS_LEFT_THRESHOLD = 3;

const ACORN_TRANSACTIONS_PAGE_SIZE = 5;

const MY_PAGE_TAB_LABEL: Record<MyPageTab, string> = {
  PROJECT: '내 프로젝트',
  QA_RECRUIT: '내 QA 모집',
  QA_PARTICIPATION: '내 QA 참여',
};

const MY_PAGE_TAB_ORDER: MyPageTab[] = [
  'PROJECT',
  'QA_RECRUIT',
  'QA_PARTICIPATION',
];

function isMyPageTab(value: string | undefined): value is MyPageTab {
  return !!value && (MY_PAGE_TAB_ORDER as string[]).includes(value);
}

const REVIEW_FILTER_QUERY_KEY = 'filter';

const MY_QA_FEEDBACK_REVIEW_FILTER_LABEL: Record<
  MyQaFeedbackReviewFilter,
  string
> = {
  ALL: '전체',
  PENDING_REVIEW: '검토 대기중',
  ACCEPTED: '수락',
  REJECTED: '거절',
};

const MY_QA_FEEDBACK_REVIEW_FILTER_ORDER: MyQaFeedbackReviewFilter[] = [
  'ALL',
  'PENDING_REVIEW',
  'ACCEPTED',
  'REJECTED',
];

function isMyQaFeedbackReviewFilter(
  value: string | undefined
): value is MyQaFeedbackReviewFilter {
  return (
    !!value && (MY_QA_FEEDBACK_REVIEW_FILTER_ORDER as string[]).includes(value)
  );
}

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

const MOCK_QA_FEEDBACK_REVIEW_STATUSES: MyQaFeedbackReviewStatus[] = [
  'PENDING_REVIEW',
  'PENDING_REVIEW',
  'PENDING_REVIEW',
  'REJECTED',
  'ACCEPTED',
  'ACCEPTED',
  'REJECTED',
  'ACCEPTED',
];

const MOCK_MY_QA_FEEDBACK_REVIEWS: MyQaFeedbackReviewItem[] =
  MOCK_QA_FEEDBACK_REVIEW_STATUSES.map((status, index) => ({
    id: `review-${index + 1}`,
    reviewerNickname: '닉네임',
    status,
    submittedAt: '2026-09-09 18:05',
    ...(status === 'PENDING_REVIEW' ? { responseDeadlineHoursLeft: 71 } : {}),
  }));

/** 상세 디자인이 확정된 모집글(id: '1')만 우선 목데이터를 제공 */
const MOCK_MY_QA_RECRUIT_DETAILS: Record<string, MyQaRecruitDetail> = {
  '1': {
    ...MOCK_MY_QA_RECRUITS[0],
    authorNickname: '닉네임',
    usedAcorn: 100,
    feedbackReviews: MOCK_MY_QA_FEEDBACK_REVIEWS,
  },
};

function getMyQaRecruitDetailById(id: string): MyQaRecruitDetail | undefined {
  return MOCK_MY_QA_RECRUIT_DETAILS[id];
}

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

const MOCK_QA_FEEDBACK_QUESTIONS: QaFeedbackQuestion[] = [
  {
    id: 'q1',
    order: 1,
    required: true,
    type: 'SINGLE_CHOICE',
    question: '어떤 시안이 메인 CTA 버튼의 위치가 가장 직관적인가요?',
    options: ['1번: 우측 상단 헤더', '2번: 화면 하단 플로팅 바', '3번: 콘텐츠 중앙'],
    selectedOption: '3번: 콘텐츠 중앙',
  },
  {
    id: 'q2',
    order: 2,
    required: false,
    type: 'TEXT',
    question:
      '1번 문항에서 선택하신 시안에서 시각적으로 아쉽거나, 동선을 방해할 것 같은 요소가 있다면 자유롭게 적어주세요.',
    answer:
      '콘텐츠 중앙에 버튼이 배치되어 있어 직관적이고 눈에는 잘 띕니다. 하지만 시안 이미지 전체를 보았을 때 본문 한가운데 위치해 있어 전체적인 디자인 통일감이나 레이아웃 균형을 깨뜨리는 느낌입니다.',
  },
  {
    id: 'q3',
    order: 3,
    required: true,
    type: 'MULTIPLE_CHOICE',
    question:
      '메인 CTA 버튼의 문구(UX 라이팅) 중 어떤 점이 다음 동작을 예측하는 데 도움이 되었나요?',
    options: [
      '한눈에 어떤 동작이 일어날지 명확하게 표현되어 있다.',
      '다음 단계의 행동과 결과가 예측 가능한 단어이다.',
      '사용자의 목적과 일치하는 직관적인 용어이다.',
    ],
    selectedOptions: [
      '한눈에 어떤 동작이 일어날지 명확하게 표현되어 있다.',
      '다음 단계의 행동과 결과가 예측 가능한 단어이다.',
    ],
  },
];

const MOCK_QA_FEEDBACK_QUESTIONS_PAYMENT: QaFeedbackQuestion[] = [
  {
    id: 'payment-q1',
    order: 1,
    required: true,
    type: 'SINGLE_CHOICE',
    question:
      '신규 결제 모듈을 통한 결제 진행 및 예외 처리 과정(결제 수단 선택, 수수료 안내 등)이 전반적으로 직관적이었나요?',
    options: [
      '오류 없이 매우 빠르고 직관적으로 완료됨',
      '결제는 완료했으나 일부 예외/에러 안내 문구가 모호함',
      '결제 진행 중 알 수 없는 오류로 멈춤 현상 발생',
      '결제 버튼 위치나 결제 정보 입력란을 찾기 어려움',
    ],
    selectedOption: '결제는 완료했으나 일부 예외/에러 안내 문구가 모호함',
  },
  {
    id: 'payment-q2',
    order: 2,
    required: true,
    type: 'SINGLE_CHOICE',
    question:
      '사용하신 디바이스 및 브라우저 환경에서 요소 겹침, 텍스트 잘림 등 레이아웃이 깨지는 현상이 있었나요?',
    options: ['전혀 없었다', '거의 없었다', '보통이다', '자주 있었다', '매우 많았다'],
    selectedOption: '거의 없었다',
  },
  {
    id: 'payment-q3',
    order: 3,
    required: false,
    type: 'TEXT',
    question: '테스트 중 발견된 결제 플로우 오류나 개선 피드백을 작성해 주세요.',
    answer:
      '모바일 웹(iOS Safari) 환경에서 결제 비밀번호 입력 키패드가 하단 결제하기 버튼을 가립니다. 스크롤이 제대로 동작하지 않아 키보드를 수동으로 내린 뒤 결제해야 하는 불편함이 있습니다.',
  },
];

/** 문항별 보기 탭에서 보여줄 문항별 집계 결과. 링크형/이미지형 모두 아래 내용은 동일해 목데이터를 공유한다. */
const MOCK_QA_RESULT_QUESTION_STATS: QaResultQuestion[] = [
  {
    id: 'result-q1',
    order: 1,
    required: true,
    question: '어떤 시안이 메인 CTA 버튼의 위치가 가장 직관적인가요?',
    type: 'SINGLE_CHOICE',
    responseCount: 8,
    optionStats: [
      { option: '1번: 우측 상단 헤더', count: 4, percent: 50 },
      { option: '2번: 화면 하단 플로팅 바', count: 3, percent: 37.5 },
      { option: '3번: 콘텐츠 중앙', count: 1, percent: 12.5 },
    ],
  },
  {
    id: 'result-q2',
    order: 2,
    required: false,
    question:
      '1번 문항에서 선택하신 시안에서 시각적으로 아쉽거나, 동선을 방해할 것 같은 요소가 있다면 자유롭게 적어주세요.',
    type: 'TEXT',
    responseCount: 8,
    answers: [
      '콘텐츠 중앙에 버튼이 배치되어 있어 직관적이고 눈에는 잘 띕니다. 하지만 시안 이미지 전체를 보았을 때 본문 한가운데 위치해 있어 전체적인 디자인 통일감이나 레이아웃 균형을 깨뜨리는 느낌입니다.',
      '헤더 영역에 위치하니 스크롤을 내려도 계속 보여서 편리했지만, 다른 메뉴 아이콘과 붙어 있어 오터치가 걱정됩니다.',
      '플로팅 바 형태라 시선이 자연스럽게 이동되지만, 하단 내비게이션과 겹쳐 보이는 기기가 있을 것 같습니다.',
      '별다른 불편함은 없었습니다.',
      '버튼 색상 대비가 낮아 배경과 잘 구분되지 않았습니다.',
      '동선 자체는 좋았지만 버튼 문구가 조금 길게 느껴졌습니다.',
      '특이사항 없습니다.',
      '중앙 배치라 콘텐츠를 가리는 느낌이 들어 스크롤 후 노출되면 더 좋을 것 같습니다.',
    ],
  },
  {
    id: 'result-q3',
    order: 3,
    required: true,
    question:
      '메인 CTA 버튼의 문구(UX 라이팅) 중 어떤 점이 다음 동작을 예측하는 데 도움이 되었나요?',
    type: 'MULTIPLE_CHOICE',
    responseCount: 8,
    optionStats: [
      { option: '한눈에 어떤 동작이 일어날지 명확하게 표현되어 있다.', count: 4, percent: 50 },
      { option: '다음 단계의 행동과 결과가 예측 가능한 단어이다.', count: 4, percent: 50 },
      { option: '사용자의 목적과 일치하는 직관적인 용어이다.', count: 2, percent: 25 },
    ],
  },
];

/** 테스터별 보기 탭에서 보여줄, 결과에 반영된(수락된) 테스터별 응답. 8명 모두 같은 문항 세트를 목데이터로 재사용한다. */
const MOCK_QA_RESULT_TESTER_ANSWERS: MyQaResultTesterAnswer[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `result-tester-${index + 1}`,
    reviewerNickname: '닉네임',
    submittedAt: '2026-09-09 18:05',
    feedbackQuestions: MOCK_QA_FEEDBACK_QUESTIONS,
  })
);

/** 상세 디자인이 확정된 모집글(이미지형: id '1', 링크형: id '2')만 우선 목데이터를 제공 */
const MOCK_MY_QA_RESULT_DETAILS: Record<string, MyQaResultDetail> = {
  '1': {
    id: '1',
    title: '메인 홈 화면 구성 시안 비교',
    tags: MOCK_MY_PROJECT_TAGS,
    authorNickname: '닉네임',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '이미지형',
    rewardAcorn: 15,
    reviewImages: ['1', '2', '3'],
    totalAcorn: 140,
    usedAcorn: 75,
    questionStats: MOCK_QA_RESULT_QUESTION_STATS,
    testerAnswers: MOCK_QA_RESULT_TESTER_ANSWERS,
  },
  '2': {
    id: '2',
    title: '신규 결제 기능 모듈 및 예외 처리 플로우 QA',
    tags: MOCK_MY_PROJECT_TAGS,
    authorNickname: '닉네임',
    startDate: '2026-09-09',
    endDate: '2026-09-14',
    contentType: '링크형',
    rewardAcorn: 20,
    reviewUrl: 'https://aibiz.example.com',
    totalAcorn: 140,
    usedAcorn: 75,
    questionStats: MOCK_QA_RESULT_QUESTION_STATS,
    testerAnswers: MOCK_QA_RESULT_TESTER_ANSWERS,
  },
};

function getMyQaResultDetailById(id: string): MyQaResultDetail | undefined {
  return MOCK_MY_QA_RESULT_DETAILS[id];
}

/** 상세 디자인이 확정된 모집글(id: '1')에 제출된 피드백만 우선 목데이터를 제공. 링크형/이미지형 화면을 모두 보여주기 위해 홀짝으로 컨텐츠 타입을 나눈다. */
const MOCK_MY_QA_FEEDBACK_REVIEW_DETAILS: Record<string, MyQaFeedbackReviewDetail> =
  Object.fromEntries(
    MOCK_MY_QA_FEEDBACK_REVIEWS.map((review, index) => {
      const isImageType = index % 2 === 1;

      return [
        review.id,
        {
          ...review,
          feedbackPostId: '1',
          contentType: isImageType ? '이미지형' : '링크형',
          ...(isImageType ? { reviewImages: ['1', '2', '3'] } : {}),
          feedbackQuestions: isImageType
            ? MOCK_QA_FEEDBACK_QUESTIONS
            : MOCK_QA_FEEDBACK_QUESTIONS_PAYMENT,
        },
      ];
    })
  );

function getMyQaFeedbackReviewDetailById(
  feedbackPostId: string,
  feedbackId: string
): MyQaFeedbackReviewDetail | undefined {
  const detail = MOCK_MY_QA_FEEDBACK_REVIEW_DETAILS[feedbackId];
  return detail?.feedbackPostId === feedbackPostId ? detail : undefined;
}

const FEEDBACK_REJECT_DETAIL_MIN_LENGTH = 20;

const FEEDBACK_REJECT_REASONS: { value: FeedbackRejectReasonValue; label: string }[] = [
  { value: 'IRRELEVANT_ANSWER', label: '질문과 무관한 답변이에요.' },
  { value: 'INSINCERE_ANSWER', label: '성의 없이 작성된 답변이에요.' },
  { value: 'NOT_ACTUALLY_TESTED', label: '테스트를 실제로 진행하지 않은 것 같아요.' },
  { value: 'ETC', label: '기타' },
];

const MOCK_QA_REJECT_REASON = {
  title: '성의 없이 작성된 답변이에요.',
  description:
    "모든 주관식 항목에 'ㅇㅇ', '좋음' 등 의미 없는 단답만 입력되어 있습니다. 서비스 개선을 위한 구체적인 피드백 내용이 확인되지 않아 거절 처리합니다.",
};

const MOCK_QA_OBJECTION_BASE = {
  submittedAt: '2026-09-14',
  reason: 'SINCERELY_WRITTEN' as const,
  detailReason:
    '요구사항에 맞춰 실제 앱을 구동하며 테스트를 진행했고, 결과 화면 스크린샷까지 함께 첨부하여 제출했습니다. 단답형이 아닌 구체적인 동선 기반으로 성실히 작성했으나 성의 없음으로 거절되어 이의를 제기합니다.',
};

const MOCK_QA_OBJECTION_RESOLVED = {
  ...MOCK_QA_OBJECTION_BASE,
  resolution: {
    result: 'ACCEPTED' as const,
    opinion:
      '제출해 주신 피드백과 이의제기 내용을 재검토한 결과, 가이드에 맞게 성실히 작성된 것으로 확인되어 수락 처리합니다.',
  },
};

/** 상세 모달 디자인이 확정된 상태(수락, 검토 대기 중, 거절, 이의제기 검토 중/완료)만 우선 목데이터를 제공 */
const MOCK_MY_QA_PARTICIPATION_DETAILS: MyQaParticipationDetail[] = MOCK_MY_QA_PARTICIPATIONS.filter(
  (participation) =>
    participation.status === 'ACCEPTED' ||
    participation.status === 'PENDING_REVIEW' ||
    participation.status === 'REJECTED' ||
    participation.status === 'DISPUTE_REVIEWING' ||
    participation.status === 'DISPUTE_RESOLVED'
).map((participation) => ({
  ...participation,
  participatedAt: '2026-09-10 18:00',
  submittedAt: '2026-09-11 12:00',
  feedbackQuestions: MOCK_QA_FEEDBACK_QUESTIONS,
  ...(participation.status === 'REJECTED' ||
  participation.status === 'DISPUTE_REVIEWING' ||
  participation.status === 'DISPUTE_RESOLVED'
    ? { rejectReason: MOCK_QA_REJECT_REASON }
    : {}),
  ...(participation.status === 'DISPUTE_REVIEWING'
    ? { objection: MOCK_QA_OBJECTION_BASE }
    : {}),
  ...(participation.status === 'DISPUTE_RESOLVED'
    ? { objection: MOCK_QA_OBJECTION_RESOLVED }
    : {}),
}));

function getMyQaParticipationDetailById(
  id: string
): MyQaParticipationDetail | undefined {
  return MOCK_MY_QA_PARTICIPATION_DETAILS.find(
    (detail) => detail.id === id
  );
}

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

const OBJECTION_DETAIL_MIN_LENGTH = 20;

const OBJECTION_REASONS: { value: ObjectionReasonValue; label: string }[] = [
  { value: 'SINCERELY_WRITTEN', label: '요청사항에 맞게 성실하게 작성했어요.' },
  {
    value: 'REASON_MISMATCH',
    label: '거절 사유가 실제 제출한 피드백 내용과 달라요.',
  },
  {
    value: 'PROJECT_ISSUE',
    label: 'QA 프로젝트 문제(오류·자료 부족)로 진행에 한계가 있었어요.',
  },
  { value: 'ETC', label: '기타' },
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
  FEEDBACK_REJECT_DETAIL_MIN_LENGTH,
  FEEDBACK_REJECT_REASONS,
  getMyQaFeedbackReviewDetailById,
  getMyQaParticipationDetailById,
  getMyQaRecruitDetailById,
  getMyQaResultDetailById,
  getTreeStageByHumidity,
  isMyPageTab,
  isMyQaFeedbackReviewFilter,
  MOCK_ACORN_TRANSACTIONS,
  MOCK_MY_PROJECTS,
  MOCK_MY_QA_PARTICIPATIONS,
  MOCK_MY_QA_RECRUITS,
  MY_PAGE_TAB_LABEL,
  MY_PAGE_TAB_ORDER,
  MY_QA_FEEDBACK_REVIEW_FILTER_LABEL,
  MY_QA_FEEDBACK_REVIEW_FILTER_ORDER,
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
  OBJECTION_DETAIL_MIN_LENGTH,
  OBJECTION_REASONS,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
  REVIEW_FILTER_QUERY_KEY,
  TREE_STAGES,
  WITHDRAW_NOTICES,
  WITHDRAW_REASONS,
};
