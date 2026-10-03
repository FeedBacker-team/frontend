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
  rewardAcorn: number;
  /** TODO: 백엔드 배포 후 실제 필드명(캐멀/스네이크 케이스)과 URL/경로 형식 확인 필요 */
  nickname?: string | null;
  /** TODO: 백엔드 배포 후 실제 필드명과 URL/경로 형식 확인 필요 */
  profileImage?: string | null;
  rejectType: string | null;
  rejectDetail: string | null;
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
