import {
  MOCK_QA_RECRUITMENT_DETAILS,
  MOCK_QA_RECRUITMENTS,
} from '@/mocks/qa';
import type {
  CreateQaRecruitmentRequest,
  CreateQaRecruitmentResponse,
  QaRecruitmentCard,
  QaRecruitmentDetailResponse,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaSort,
} from '@/types/qa';
import { QaApiError } from '@/types/qa';

const DEFAULT_QA_PAGE_SIZE = 5;
const QA_PATHS = {
  recruitments: '/api/feedback-posts',
  detail: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}`,
  participations: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/participations`,
} as const;

type NormalizedQaRecruitmentListParams = {
  keyword?: string;
  tags?: QaRecruitmentListParams['tags'];
  sort: QaSort;
  page: number;
  size: number;
};

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

function sortMockQaRecruitments(
  qas: QaRecruitmentCard[],
  sort: QaSort
) {
  const sorted = [...qas];

  if (sort === 'DEADLINE') {
    return sorted.sort((a, b) => a.endAt.localeCompare(b.endAt));
  }

  if (sort === 'REWARD') {
    return sorted.sort(
      (a, b) =>
        b.requiredAcorns / b.capacity - a.requiredAcorns / a.capacity
    );
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
  const response = await fetch(`${baseUrl}${QA_PATHS.recruitments}?${query}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('QA 모집 목록을 불러오지 못했습니다');
  }

  return response.json();
}

async function parseQaError(response: Response, fallbackMessage: string) {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }
  } catch {
    // 에러 body가 JSON이 아닌 경우
  }

  return fallbackMessage;
}

async function getQaRecruitmentDetail(
  feedbackPostId: string,
  signal?: AbortSignal
): Promise<QaRecruitmentDetailResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const detail = MOCK_QA_RECRUITMENT_DETAILS.find(
      (item) => item.feedbackPostId === feedbackPostId
    );

    if (!detail) {
      throw new Error('피드백 모집글을 찾을 수 없습니다.');
    }

    return detail;
  }

  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  // TODO: 실제 인증 연동 시 메모리에서 관리하는 access token을
  // Authorization: Bearer 헤더로 공통 API 클라이언트에서 주입한다.
  const response = await fetch(`${baseUrl}${QA_PATHS.detail(feedbackPostId)}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await parseQaError(
        response,
        response.status === 404
          ? '피드백 모집글을 찾을 수 없습니다.'
          : 'QA 모집글을 불러오지 못했습니다'
      )
    );
  }

  return response.json();
}

async function createQaRecruitment(
  body: CreateQaRecruitmentRequest
): Promise<CreateQaRecruitmentResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      feedbackPostId:
        body.target === 'IMAGE'
          ? '660e8400-e29b-41d4-a716-446655440001'
          : '660e8400-e29b-41d4-a716-446655440000',
    };
  }

  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}${QA_PATHS.recruitments}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      await parseQaError(response, 'QA 모집 글 등록에 실패했습니다')
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== 'object' ||
    data === null ||
    !('feedbackPostId' in data) ||
    typeof data.feedbackPostId !== 'string'
  ) {
    throw new Error('QA 모집 글 등록 응답 형식이 올바르지 않습니다');
  }

  return { feedbackPostId: data.feedbackPostId };
}

async function participateInQa(feedbackPostId: string): Promise<void> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }

  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  // TODO: 실제 인증 연동 시 메모리 access token을 Bearer 헤더로 주입한다.
  const response = await fetch(
    `${baseUrl}${QA_PATHS.participations(feedbackPostId)}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new QaApiError(
      await parseQaError(response, 'QA 참여 신청에 실패했습니다'),
      response.status
    );
  }

  // TODO: 참여 성공 응답 명세가 확정되면 참여 ID 등 필요한 값을 반환한다.
}

export {
  createQaRecruitment,
  getQaRecruitmentDetail,
  getQaRecruitments,
  participateInQa,
};
