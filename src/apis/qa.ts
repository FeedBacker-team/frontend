import {
  MOCK_QA_FEEDBACK_FORMS,
  MOCK_QA_RECRUITMENT_DETAILS,
} from '@/mocks/qa';
import { apiRequest } from '@/apis/client';
import { getQaRecruitments } from '@/apis/qaRecruitments';
import type {
  CreateQaRecruitmentRequest,
  CreateQaRecruitmentResponse,
  MyQaParticipation,
  MyQaRecruitment,
  QaFeedbackFormResponse,
  QaRecruitmentDetailResponse,
  QaResultResponse,
  SubmitQaFeedbackRequest,
  SubmitQaFeedbackResponse,
} from '@/types/qa';
import { QaApiError } from '@/types/qa';

const QA_PATHS = {
  recruitments: '/api/feedback-posts',
  detail: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}`,
  feedbackForm: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/form`,
  participations: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/participations`,
  giveUp: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/giveup`,
  complete: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/complete`,
  feedbackProgress: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/feedbacks`,
  result: (feedbackPostId: string) =>
    `/api/feedback-posts/${encodeURIComponent(feedbackPostId)}/result`,
  feedbacks: '/api/feedbacks',
  myRecruitments: '/api/feedback-posts/mine',
  myParticipations: '/api/feedbacks/mine',
} as const;

type QaQuestionConfigApiResponse = {
  totalCount: number;
  choiceQuestionCount: number;
  subjectiveCount: number;
  estimatedMinutes: number;
};

type FeedbackProgressApiResponse = {
  feedbackId: string;
  testerName: string | null;
  testerProfileImageUrl: string | null;
  status: MyQaParticipation['status'];
  submitAt: string;
  responseDeadlineAt: string;
};

type FeedbackProgressListApiResponse = {
  feedbackProgress: FeedbackProgressApiResponse[];
};

type QaRecruitmentDetailApiResponse = Omit<
  QaRecruitmentDetailResponse,
  'status' | 'questionConfig'
> & {
  feedbackPostStatus: QaRecruitmentDetailResponse['status'];
  questionConfig: QaQuestionConfigApiResponse;
};

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

  const response = await apiRequest<FeedbackProgressListApiResponse>(
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

  return response.feedbackProgress;
}

async function getQaResult(
  feedbackPostId: string,
  signal?: AbortSignal
): Promise<QaResultResponse> {
  return apiRequest<QaResultResponse>(QA_PATHS.result(feedbackPostId), {
    method: 'GET',
    signal,
    fallbackMessage: (status) =>
      status === 404
        ? '피드백 모집글을 찾을 수 없습니다.'
        : 'QA 결과를 불러오지 못했습니다',
  });
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

async function giveUpQaParticipation(feedbackPostId: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }

  return apiRequest<void>(QA_PATHS.giveUp(feedbackPostId), {
    method: 'PATCH',
    responseType: 'void',
    fallbackMessage: 'QA 참여 포기에 실패했습니다',
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
  giveUpQaParticipation,
  getFeedbackProgressList,
  getMyQaParticipations,
  getMyQaRecruitments,
  getQaFeedbackForm,
  getQaRecruitmentDetail,
  getQaRecruitments,
  getQaResult,
  participateInQa,
  submitQaFeedback,
};
export type { FeedbackProgressApiResponse };
