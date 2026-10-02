import { format } from 'date-fns';

import type { FeedbackDetailResponse } from '@/apis/feedbacks';
import { FEEDBACK_REJECT_REASONS } from '@/constants/mypage';
import type { FiledObjection } from '@/stores/objectionStore';
import type {
  MyQaFeedbackReviewDetail,
  MyQaFeedbackReviewStatus,
  MyQaParticipationDetail,
  QaContentType,
  QaFeedbackQuestion,
  QaRejectReason,
} from '@/types/mypage';
import type { MyQaParticipationStatus } from '@/types/qa';

/** 백엔드가 아직 테스터 닉네임을 내려주지 않아 사용하는 임시 표시값 */
const UNKNOWN_REVIEWER_NICKNAME = '테스터';

function mapFeedbackStatusToReviewStatus(
  status: MyQaParticipationStatus
): MyQaFeedbackReviewStatus {
  if (status === 'ACCEPTED' || status === 'REJECTED') {
    return status;
  }

  return 'PENDING_REVIEW';
}

function mapTargetTypeToContentType(
  targetType: FeedbackDetailResponse['targetType']
): QaContentType {
  return targetType === 'IMAGE' ? '이미지형' : '링크형';
}

function toDateTimeDisplay(value: string) {
  return format(new Date(value), 'yyyy-MM-dd HH:mm');
}

function computeResponseDeadlineHoursLeft(responseDeadlineAt: string) {
  const hoursLeft = Math.ceil(
    (new Date(responseDeadlineAt).getTime() - Date.now()) / (1000 * 60 * 60)
  );

  return Math.max(0, hoursLeft);
}

/**
 * 상세보기 응답은 각 객관식 문항이 단일/다중 선택이었는지 알려주지 않는다.
 * 대신 같은 모집글의 작성 폼 설정(maxSelectionCount)을 order로 대조해 판별하고,
 * 대조할 정보가 없으면(메이커-테스터 간 feedbackPostId를 모르는 화면 등) 다중선택으로 간주한다.
 */
function buildFeedbackQuestions(
  response: FeedbackDetailResponse['questionAnswerResponses'],
  choiceMaxSelections?: Map<number, number>
): QaFeedbackQuestion[] {
  const choiceQuestions: QaFeedbackQuestion[] =
    response.choiceQuestionAnswerResponses.map((question) => {
      const selectedOptions = (question.selectedOption ?? [])
        .map((index) => question.optionText[index])
        .filter((option): option is string => option !== undefined);

      if (choiceMaxSelections?.get(question.order) === 1) {
        return {
          id: `choice-${question.order}`,
          order: question.order,
          required: true,
          type: 'SINGLE_CHOICE',
          question: question.questionText,
          options: question.optionText,
          selectedOption: selectedOptions[0] ?? '',
        };
      }

      return {
        id: `choice-${question.order}`,
        order: question.order,
        required: true,
        type: 'MULTIPLE_CHOICE',
        question: question.questionText,
        options: question.optionText,
        selectedOptions,
      };
    });

  const subjectiveQuestions: QaFeedbackQuestion[] =
    response.subjectiveQuestionAnswerResponses.map((question) => ({
      id: `text-${question.order}`,
      order: question.order,
      required: true,
      type: 'TEXT',
      question: question.questionText,
      answer: question.answerText ?? '',
    }));

  return [...choiceQuestions, ...subjectiveQuestions].sort(
    (a, b) => a.order - b.order
  );
}

function collectReviewImages(
  response: FeedbackDetailResponse['questionAnswerResponses']
): string[] {
  const urls = [
    ...response.choiceQuestionAnswerResponses.flatMap((question) =>
      question.images.map((image) => image.url)
    ),
    ...response.subjectiveQuestionAnswerResponses.flatMap((question) =>
      question.images.map((image) => image.url)
    ),
  ];

  return Array.from(new Set(urls));
}

function mapFeedbackDetailToReviewDetail(
  feedbackPostId: string,
  feedbackId: string,
  response: FeedbackDetailResponse,
  choiceMaxSelections?: Map<number, number>
): MyQaFeedbackReviewDetail {
  const status = mapFeedbackStatusToReviewStatus(response.feedbackStatus);
  const contentType = mapTargetTypeToContentType(response.targetType);
  const reviewImages = collectReviewImages(response.questionAnswerResponses);

  return {
    id: feedbackId,
    feedbackPostId,
    reviewerNickname: UNKNOWN_REVIEWER_NICKNAME,
    status,
    submittedAt: response.submitAt,
    ...(status === 'PENDING_REVIEW'
      ? {
          responseDeadlineHoursLeft: computeResponseDeadlineHoursLeft(
            response.responseDeadlineAt
          ),
        }
      : {}),
    contentType,
    ...(contentType === '이미지형' && reviewImages.length > 0
      ? { reviewImages }
      : {}),
    feedbackQuestions: buildFeedbackQuestions(
      response.questionAnswerResponses,
      choiceMaxSelections
    ),
  };
}

function getRejectReason(
  response: FeedbackDetailResponse
): QaRejectReason | undefined {
  if (!response.rejectType) {
    return undefined;
  }

  const label =
    FEEDBACK_REJECT_REASONS.find((item) => item.value === response.rejectType)
      ?.label ?? response.rejectType;

  return { title: label, description: response.rejectDetail ?? '' };
}

/**
 * 테스터 본인이 제출한 피드백을 보는 화면(이의제기 작성, 참여 상세 모달)용 매핑.
 * 이 화면들은 feedbackPostId를 모르는 경로(/mypage/objection/[feedbackId])에서도
 * 쓰이므로 choiceMaxSelections 대조 없이 항상 다중선택 UI로 보여준다.
 * QA 모집 기간(startDate/endDate)도 이 API로는 알 수 없어 빈 값으로 둔다.
 */
function mapFeedbackDetailToParticipationDetail(
  feedbackId: string,
  response: FeedbackDetailResponse,
  filedObjection: FiledObjection | undefined
): MyQaParticipationDetail {
  const baseStatus = mapFeedbackStatusToReviewStatus(response.feedbackStatus);
  const status =
    baseStatus === 'REJECTED' && filedObjection
      ? 'DISPUTE_REVIEWING'
      : baseStatus;

  return {
    id: feedbackId,
    title: response.feedbackPostTitle,
    status,
    startDate: '',
    endDate: '',
    contentType: mapTargetTypeToContentType(response.targetType),
    daysLeft: null,
    rewardAcorn: response.rewardAcorn,
    participatedAt: toDateTimeDisplay(response.participateAt),
    submittedAt: toDateTimeDisplay(response.submitAt),
    feedbackQuestions: buildFeedbackQuestions(
      response.questionAnswerResponses
    ),
    rejectReason: getRejectReason(response),
    ...(filedObjection ? { objection: filedObjection } : {}),
  };
}

export {
  computeResponseDeadlineHoursLeft,
  mapFeedbackDetailToParticipationDetail,
  mapFeedbackDetailToReviewDetail,
  UNKNOWN_REVIEWER_NICKNAME,
};
