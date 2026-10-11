import type {
  ImageResponse,
  MyQaParticipationStatus,
  QaTargetType,
} from '@/types/qa';

import { feedbackRequest } from './request';

function buildFeedbackPath(feedbackId: string) {
  return `/api/feedbacks/${encodeURIComponent(feedbackId)}`;
}

type FeedbackChoiceAnswerResponse = {
  order: number;
  questionText: string;
  optionText: string[];
  optionCount: number;
  selectedOption: number[] | null;
  images: ImageResponse[];
};

type FeedbackSubjectiveAnswerResponse = {
  order: number;
  questionText: string;
  answerText: string | null;
  images: ImageResponse[];
};

type FeedbackDetailResponse = {
  feedbackPostTitle: string;
  feedbackStatus: MyQaParticipationStatus;
  targetType: QaTargetType;
  /** 거절된 참여는 보상이 없어 null로 내려온다 */
  rewardAcorn: number | null;
  testerName?: string | null;
  testerProfileImageUrl?: string | null;
  rejectType: string | null;
  rejectDetail: string | null;
  objectReason: string | null;
  /** 운영팀 검토 의견. 이의제기 검토가 완료되기 전에는 null */
  objectResult: string | null;
  thumbnail: ImageResponse | null;
  startAt: string;
  endAt: string;
  participateAt: string;
  submitAt: string;
  responseDeadlineAt: string;
  questionAnswerResponses: {
    choiceQuestionAnswerResponses: FeedbackChoiceAnswerResponse[];
    subjectiveQuestionAnswerResponses: FeedbackSubjectiveAnswerResponse[];
  };
};

async function getFeedbackDetail(
  feedbackId: string,
  signal?: AbortSignal
): Promise<FeedbackDetailResponse> {
  return feedbackRequest<FeedbackDetailResponse>(
    buildFeedbackPath(feedbackId),
    {
      method: 'GET',
      signal,
      fallbackMessage: (status) =>
        status === 403
          ? '이 피드백에 접근할 권한이 없습니다.'
          : status === 404
            ? '피드백을 찾을 수 없습니다.'
            : '피드백을 불러오지 못했습니다',
    }
  );
}

export { getFeedbackDetail };
export type {
  FeedbackChoiceAnswerResponse,
  FeedbackDetailResponse,
  FeedbackSubjectiveAnswerResponse,
};
