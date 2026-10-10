import {
  MOCK_QA_RECRUITMENT_DETAILS,
  MOCK_QA_RECRUITMENTS,
} from '@/mocks/qa';
import type { ProjectTag } from '@/types/project';
import type {
  QaRecruitmentCard,
  QaRecruitmentDetailResponse,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaSort,
} from '@/types/qa';

const DEFAULT_QA_PAGE_SIZE = 5;
const QA_RECRUITMENTS_PATH = '/api/feedback-posts';

type QaQuestionConfigApiResponse = {
  totalCount: number;
  choiceQuestionCount: number;
  subjectiveCount: number;
  estimatedMinutes: number;
};

type PublicQaRecruitmentDetailApiResponse = Omit<
  QaRecruitmentDetailResponse,
  'status' | 'questionConfig'
> & {
  feedbackPostStatus: QaRecruitmentDetailResponse['status'];
  questionConfig: QaQuestionConfigApiResponse;
};

type NormalizedQaRecruitmentListParams = {
  keyword?: string;
  tags?: QaRecruitmentListParams['tags'];
  sort: QaSort;
  page: number;
  size: number;
};

type QaRecruitmentCardResponse = {
  feedback_post_id: string;
  project_id: string;
  project_title: string;
  title: string;
  thumbnail_url: string | null;
  tags: ProjectTag[];
  status: QaRecruitmentCard['status'];
  target_type: QaRecruitmentCard['targetType'];
  start_at: string;
  end_at: string;
  slot_capacity: number;
  remain_slot_count: number;
  reward_acorn: number;
};

type QaRecruitmentListApiResponse = {
  total_count: number;
  page: number;
  size: number;
  has_next: boolean;
  feedback_posts: QaRecruitmentCardResponse[];
};

function mapQaRecruitmentCard(
  response: QaRecruitmentCardResponse
): QaRecruitmentCard {
  return {
    feedbackPostId: response.feedback_post_id,
    projectId: response.project_id,
    projectTitle: response.project_title,
    title: response.title,
    thumbnailUrl: response.thumbnail_url,
    tags: response.tags,
    status: response.status,
    targetType: response.target_type,
    startAt: response.start_at,
    endAt: response.end_at,
    capacity: response.slot_capacity,
    participantCount: Math.max(
      0,
      response.slot_capacity - response.remain_slot_count
    ),
    requiredAcorns: response.reward_acorn * response.slot_capacity,
    createdAt: response.start_at,
  };
}

function mapQaRecruitmentListResponse(
  response: QaRecruitmentListApiResponse
): QaRecruitmentListResponse {
  return {
    totalCount: response.total_count,
    page: response.page,
    size: response.size,
    hasNext: response.has_next,
    feedbackPosts: response.feedback_posts.map(mapQaRecruitmentCard),
  };
}

function normalizeQaRecruitmentListParams(
  params: QaRecruitmentListParams
): NormalizedQaRecruitmentListParams {
  return {
    keyword: params.keyword?.trim() || undefined,
    tags: params.tags?.length ? params.tags : undefined,
    sort: params.sort ?? 'LATEST',
    page: params.page ?? 0,
    size: params.size ?? DEFAULT_QA_PAGE_SIZE,
  };
}

function buildQaRecruitmentListQuery(
  params: NormalizedQaRecruitmentListParams
) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }

  if (params.tags?.length) {
    searchParams.set('tags', params.tags.join(','));
  }

  searchParams.set('status', 'RECRUITING');
  searchParams.set('sort', params.sort);
  searchParams.set('page', String(params.page));
  searchParams.set('size', String(params.size));

  return searchParams.toString();
}

function sortMockQaRecruitments(qas: QaRecruitmentCard[], sort: QaSort) {
  const sorted = [...qas];

  if (sort === 'DEADLINE') {
    return sorted.sort((a, b) => a.endAt.localeCompare(b.endAt));
  }

  return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function getMockQaRecruitmentList(
  params: NormalizedQaRecruitmentListParams
): QaRecruitmentListResponse {
  const keyword = params.keyword?.toLowerCase();
  const filtered = MOCK_QA_RECRUITMENTS.filter(
    (qa) => qa.status === 'RECRUITING'
  )
    .filter(
      (qa) =>
        !keyword ||
        qa.title.toLowerCase().includes(keyword) ||
        qa.projectTitle.toLowerCase().includes(keyword)
    )
    .filter(
      (qa) =>
        !params.tags?.length ||
        params.tags.every((tag) => qa.tags.includes(tag))
    );
  const sorted = sortMockQaRecruitments(filtered, params.sort);
  const start = params.page * params.size;
  const end = start + params.size;

  return {
    totalCount: sorted.length,
    page: params.page,
    size: params.size,
    hasNext: end < sorted.length,
    feedbackPosts: sorted.slice(start, end),
  };
}

async function getQaRecruitments(
  params: QaRecruitmentListParams = {},
  signal?: AbortSignal
): Promise<QaRecruitmentListResponse> {
  const normalized = normalizeQaRecruitmentListParams(params);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockQaRecruitmentList(normalized);
  }

  const query = buildQaRecruitmentListQuery(normalized);
  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}${QA_RECRUITMENTS_PATH}?${query}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('QA 모집 목록을 불러오지 못했습니다');
  }

  const data: QaRecruitmentListApiResponse = await response.json();

  return mapQaRecruitmentListResponse(data);
}

async function getPublicQaRecruitmentDetail(
  feedbackPostId: string
): Promise<QaRecruitmentDetailResponse | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    const detail = MOCK_QA_RECRUITMENT_DETAILS.find(
      (item) => item.feedbackPostId === feedbackPostId
    );

    return detail ?? null;
  }

  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const response = await fetch(
    `${baseUrl}${QA_RECRUITMENTS_PATH}/${encodeURIComponent(feedbackPostId)}`,
    { next: { revalidate: 300 } }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('QA 모집글을 불러오지 못했습니다');
  }

  const { feedbackPostStatus, questionConfig, ...detail } =
    (await response.json()) as PublicQaRecruitmentDetailApiResponse;

  return {
    ...detail,
    status: feedbackPostStatus,
    questionConfig: {
      totalQuestionCount: questionConfig.totalCount,
      choiceQuestionCount: questionConfig.choiceQuestionCount,
      subjectiveQuestionCount: questionConfig.subjectiveCount,
      estimatedTime: questionConfig.estimatedMinutes,
    },
  };
}

export { getPublicQaRecruitmentDetail, getQaRecruitments };
