import {
  MOCK_QA_FEEDBACK_FORMS,
  MOCK_QA_RECRUITMENT_DETAILS,
  MOCK_QA_RECRUITMENTS,
} from '@/mocks/qa';
import { apiRequest } from '@/apis/client';
import type {
  CreateQaRecruitmentRequest,
  CreateQaRecruitmentResponse,
  MyQaParticipation,
  MyQaRecruitment,
  QaFeedbackFormResponse,
  QaRecruitmentCard,
  QaRecruitmentDetailResponse,
  QaRecruitmentListParams,
  QaRecruitmentListResponse,
  QaSort,
  SubmitQaFeedbackRequest,
  SubmitQaFeedbackResponse,
} from '@/types/qa';
import { QaApiError } from '@/types/qa';
import type { ProjectTag } from '@/types/project';

const DEFAULT_QA_PAGE_SIZE = 5;
const QA_PATHS = {
  recruitments: '/api/feedback-posts',
  detail: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}`,
  feedbackForm: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/form`,
  participations: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/participations`,
  complete: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/complete`,
  feedbackProgress: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/feedbacks`,
  feedbacks: '/api/feedbacks',
  myRecruitments: '/api/feedback-posts/mine',
  myParticipations: '/api/feedbacks/mine',
} as const;

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

type QaQuestionConfigApiResponse = {
  totalCount: number;
  choiceQuestionCount: number;
  subjectiveCount: number;
  estimatedMinutes: number;
};

type FeedbackProgressApiResponse = {
  feedbackId: string;
  testerName: string | null;
  status: MyQaParticipation['status'];
  submitAt: string;
  responseDeadlineAt: string;
};

type QaRecruitmentDetailApiResponse = Omit<
  QaRecruitmentDetailResponse,
  'status' | 'questionConfig'
> & {
  feedbackPostStatus: QaRecruitmentDetailResponse['status'];
  questionConfig: QaQuestionConfigApiResponse;
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

function mapQaRecruitmentDetailResponse(
  response: QaRecruitmentDetailApiResponse
): QaRecruitmentDetailResponse {
  const { feedbackPostStatus, questionConfig, ...detail } = response;

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

  const data: QaRecruitmentListApiResponse = await response.json();

  return mapQaRecruitmentListResponse(data);
}

async function getMyQaRecruitments(
  signal?: AbortSignal
): Promise<MyQaRecruitment[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  }

  return apiRequest<MyQaRecruitment[]>(QA_PATHS.myRecruitments, {
    method: 'GET',
    signal,
    fallbackMessage: '내 QA 모집 목록을 불러오지 못했습니다',
  });
}

async function getMyQaParticipations(
  signal?: AbortSignal
): Promise<MyQaParticipation[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  }

  return apiRequest<MyQaParticipation[]>(QA_PATHS.myParticipations, {
    method: 'GET',
    signal,
    fallbackMessage: '내 QA 참여 목록을 불러오지 못했습니다',
  });
}

async function getFeedbackProgressList(
  feedbackPostId: string,
  signal?: AbortSignal
): Promise<FeedbackProgressApiResponse[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  }

  return apiRequest<FeedbackProgressApiResponse[]>(
    QA_PATHS.feedbackProgress(feedbackPostId),
    {
      method: 'GET',
      signal,
      fallbackMessage: (status) =>
        status === 403
          ? '게시글 작성자만 조회할 수 있습니다.'
          : status === 404
            ? '피드백 모집글을 찾을 수 없습니다.'
            : '제출된 피드백 목록을 불러오지 못했습니다',
    }
  );
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

  const response = await apiRequest<QaRecruitmentDetailApiResponse>(
    QA_PATHS.detail(feedbackPostId),
    {
      method: 'GET',
      signal,
      fallbackMessage: (status) =>
        status === 404
          ? '피드백 모집글을 찾을 수 없습니다.'
          : 'QA 모집글을 불러오지 못했습니다',
    }
  );

  return mapQaRecruitmentDetailResponse(response);
}

async function getQaFeedbackForm(
  feedbackPostId: string,
  signal?: AbortSignal
): Promise<QaFeedbackFormResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const form = MOCK_QA_FEEDBACK_FORMS[feedbackPostId];

    if (!form) {
      throw new QaApiError('QA 작성 정보를 찾을 수 없습니다.', 404);
    }

    return form;
  }

  return apiRequest<QaFeedbackFormResponse>(
    QA_PATHS.feedbackForm(feedbackPostId),
    {
      method: 'GET',
      signal,
      fallbackMessage: (status) =>
        status === 404
          ? 'QA 작성 정보를 찾을 수 없습니다.'
          : 'QA 작성 화면을 불러오지 못했습니다',
    }
  );
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

  const data = await apiRequest<unknown>(QA_PATHS.recruitments, {
    method: 'POST',
    json: body,
    fallbackMessage: 'QA 모집 글 등록에 실패했습니다',
  });

  if (
    typeof data !== 'object' ||
    data === null ||
    !('feedbackPostId' in data) ||
    typeof data.feedbackPostId !== 'string' ||
    data.feedbackPostId.length === 0
  ) {
    throw new Error('QA 모집 글 등록 응답 형식이 올바르지 않습니다');
  }

  return { feedbackPostId: data.feedbackPostId };
}

async function participateInQa(feedbackPostId: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }

  return apiRequest<void>(QA_PATHS.participations(feedbackPostId), {
    method: 'POST',
    responseType: 'void',
    fallbackMessage: 'QA 참여 신청에 실패했습니다',
  });
}

async function completeQaRecruitment(feedbackPostId: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }

  return apiRequest<void>(QA_PATHS.complete(feedbackPostId), {
    method: 'PATCH',
    responseType: 'void',
    fallbackMessage: 'QA 모집 조기 마감에 실패했습니다',
  });
}

async function submitQaFeedback(
  body: SubmitQaFeedbackRequest
): Promise<SubmitQaFeedbackResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { feedbackId: '770e8400-e29b-41d4-a716-446655440000' };
  }

  const data = await apiRequest<unknown>(QA_PATHS.feedbacks, {
    method: 'POST',
    json: body,
    fallbackMessage: '피드백 제출에 실패했습니다',
  });

  if (typeof data === 'string' && data.length > 0) {
    return { feedbackId: data };
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'feedbackId' in data &&
    typeof data.feedbackId === 'string'
  ) {
    return { feedbackId: data.feedbackId };
  }

  throw new Error('피드백 제출 응답 형식이 올바르지 않습니다');
}

export {
  completeQaRecruitment,
  createQaRecruitment,
  getFeedbackProgressList,
  getMyQaParticipations,
  getMyQaRecruitments,
  getQaFeedbackForm,
  getQaRecruitmentDetail,
  getQaRecruitments,
  participateInQa,
  submitQaFeedback,
};
export type { FeedbackProgressApiResponse };
