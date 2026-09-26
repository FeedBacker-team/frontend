import { MOCK_QA_RECRUITMENTS } from '@/mocks/qa';
import type {
  QaRecruitmentCard,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaSort,
} from '@/types/qa';

const DEFAULT_QA_PAGE_SIZE = 5;

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
  const response = await fetch(`${baseUrl}/api/feedback-posts?${query}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('QA 모집 목록을 불러오지 못했습니다');
  }

  return response.json();
}

export { getQaRecruitments };
