import { format } from 'date-fns';

import type { FeedbackDetailResponse } from '@/apis/feedbacks';
import { FEEDBACK_REJECT_REASONS } from '@/constants/mypage';
import { normalizeImageUrl } from '@/lib/image';
import { getQaDaysRemaining } from '@/lib/qa/deadline';
import type { FiledObjection } from '@/stores/objectionStore';
import type {
  MyQaFeedbackReviewDetail,
  MyQaFeedbackReviewStatus,
  MyQaParticipationDetail,
  MyQaParticipationStatus as MypageParticipationStatus,
  QaContentType,
  QaFeedbackQuestion,
  QaRejectReason,
} from '@/types/mypage';
import type { MyQaParticipationStatus } from '@/types/qa';

/** 응답에 닉네임이 없을 때(null) 쓰는 대체 표시값 */
const UNKNOWN_REVIEWER_NICKNAME = '테스터';

/**
 * 메이커가 보는 리뷰 상태는 이의제기 단계를 구분하지 않는다(수락/거절/대기만 존재).
 * 이의제기 관련 상태(OBJECTED 등)는 거절 처리된 건이므로 REJECTED로 묶는다.
 */
function mapFeedbackStatusToReviewStatus(
  status: MyQaParticipationStatus
): MyQaFeedbackReviewStatus {
  if (status === 'ACCEPTED') {
    return 'ACCEPTED';
  }

  if (
    status === 'REJECTED' ||
    status === 'OBJECTED' ||
    status === 'OBJECTION_ACCEPTED' ||
    status === 'OBJECTION_REJECTED'
  ) {
    return 'REJECTED';
  }

  return 'PENDING_REVIEW';
}

/**
 * 테스터 본인이 보는 참여 상세용 상태 매핑. 이의제기 접수 직후 백엔드 상태(OBJECTED)가
 * 아직 반영되기 전이면 filedObjection으로 "검토 중"을 낙관적으로 표시한다.
 */
function mapFeedbackStatusToParticipationStatus(
  status: MyQaParticipationStatus,
  filedObjection: FiledObjection | undefined
): MypageParticipationStatus {
  switch (status) {
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'OBJECTED':
      return 'DISPUTE_REVIEWING';
    case 'OBJECTION_ACCEPTED':
    case 'OBJECTION_REJECTED':
      return 'DISPUTE_RESOLVED';
    case 'REJECTED':
      return filedObjection ? 'DISPUTE_REVIEWING' : 'REJECTED';
    default:
      return 'PENDING_REVIEW';
  }
}

function mapTargetTypeToContentType(
  targetType: FeedbackDetailResponse['targetType']
): QaContentType {
  return targetType === 'IMAGE' ? '이미지형' : '링크형';
}

function toDateTimeDisplay(value: string) {
  return format(new Date(value), 'yyyy-MM-dd HH:mm');
}

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function computeParticipationDaysLeft(endAt: string) {
  const isRecruiting = new Date(endAt).getTime() > Date.now();
  return isRecruiting ? getQaDaysRemaining(endAt) : null;
}

function computeResponseDeadlineHoursLeft(responseDeadlineAt: string) {
  const hoursLeft = Math.ceil(
    (new Date(responseDeadlineAt).getTime() - Date.now()) / (1000 * 60 * 60)
  );

  return Math.max(0, hoursLeft);
}

type ChoiceQuestionMeta = {
  isRequire: boolean;
  maxSelectionCount: number;
};

/**
 * 상세보기 응답은 각 객관식 문항이 단일/다중 선택이었는지, 필수 여부가 무엇인지 알려주지 않는다.
 * 대신 같은 모집글의 작성 폼 설정(maxSelectionCount, isRequire)을 order로 대조해 판별하고,
 * 대조할 정보가 없으면(메이커-테스터 간 feedbackPostId를 모르는 화면 등) 다중선택/필수로 간주한다.
 */
function buildFeedbackQuestions(
  response: FeedbackDetailResponse['questionAnswerResponses'],
  choiceMeta?: Map<number, ChoiceQuestionMeta>,
  subjectiveRequired?: Map<number, boolean>
): QaFeedbackQuestion[] {
  const choiceQuestions: QaFeedbackQuestion[] =
    response.choiceQuestionAnswerResponses.map((question) => {
      const meta = choiceMeta?.get(question.order);
      const selectedOptions = (question.selectedOption ?? [])
        .map((index) => question.optionText[index - 1])
        .filter((option): option is string => option !== undefined);

      if (meta?.maxSelectionCount === 1) {
        return {
          id: `choice-${question.order}`,
          order: question.order,
          required: meta?.isRequire ?? true,
          type: 'SINGLE_CHOICE',
          question: question.questionText,
          options: question.optionText,
          selectedOption: selectedOptions[0] ?? '',
        };
      }

      return {
        id: `choice-${question.order}`,
        order: question.order,
        required: meta?.isRequire ?? true,
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
      required: subjectiveRequired?.get(question.order) ?? true,
      type: 'TEXT',
      question: question.questionText,
      answer: question.answerText ?? '',
      ...(question.images.length > 0
        ? { images: question.images.map((image) => image.url) }
        : {}),
    }));

  return [...choiceQuestions, ...subjectiveQuestions].sort(
    (a, b) => a.order - b.order
  );
}

function mapFeedbackDetailToReviewDetail(
  feedbackPostId: string,
  feedbackId: string,
  response: FeedbackDetailResponse,
  choiceMeta?: Map<number, ChoiceQuestionMeta>,
  subjectiveRequired?: Map<number, boolean>
): MyQaFeedbackReviewDetail {
  const status = mapFeedbackStatusToReviewStatus(response.feedbackStatus);
  const contentType = mapTargetTypeToContentType(response.targetType);

  return {
    id: feedbackId,
    feedbackPostId,
    reviewerNickname: response.testerName ?? UNKNOWN_REVIEWER_NICKNAME,
    reviewerProfileImageUrl: normalizeImageUrl(response.testerProfileImageUrl),
    status,
    submittedAt: toDateTimeDisplay(response.submitAt),
    ...(status === 'PENDING_REVIEW'
      ? {
          responseDeadlineHoursLeft: computeResponseDeadlineHoursLeft(
            response.responseDeadlineAt
          ),
        }
      : {}),
    contentType,
    feedbackQuestions: buildFeedbackQuestions(
      response.questionAnswerResponses,
      choiceMeta,
      subjectiveRequired
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
 */
function mapFeedbackDetailToParticipationDetail(
  feedbackId: string,
  response: FeedbackDetailResponse,
  filedObjection: FiledObjection | undefined
): MyQaParticipationDetail {
  const status = mapFeedbackStatusToParticipationStatus(
    response.feedbackStatus,
    filedObjection
  );

  return {
    id: feedbackId,
    title: response.feedbackPostTitle,
    thumbnailUrl: normalizeImageUrl(response.thumbnail?.url),
    status,
    startDate: toDateOnly(response.startAt),
    endDate: toDateOnly(response.endAt),
    contentType: mapTargetTypeToContentType(response.targetType),
    daysLeft: computeParticipationDaysLeft(response.endAt),
    completeDate: null,
    rewardAcorn: response.rewardAcorn,
    participatedAt: toDateTimeDisplay(response.participateAt),
    submittedAt: toDateTimeDisplay(response.submitAt),
    feedbackQuestions: buildFeedbackQuestions(response.questionAnswerResponses),
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
export type { ChoiceQuestionMeta };
