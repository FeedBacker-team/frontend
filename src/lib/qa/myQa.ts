import { PROJECT_TAG_LABEL } from '@/constants/project';
import {
  computeResponseDeadlineHoursLeft,
  UNKNOWN_REVIEWER_NICKNAME,
} from '@/lib/feedback';
import { normalizeImageUrl } from '@/lib/image';
import type {
  MyQaFeedbackReviewItem,
  MyQaParticipationItem,
  MyQaParticipationStatus as MypageParticipationStatus,
  MyQaRecruitDetail,
  MyQaRecruitItem,
  QaContentType,
} from '@/types/mypage';
import type { FeedbackProgressApiResponse } from '@/apis/qa';
import type {
  MyQaParticipation,
  MyQaRecruitment,
  QaRecruitmentDetailResponse,
  QaTargetType,
} from '@/types/qa';

function toContentType(targetType: QaTargetType | undefined): QaContentType {
  return targetType === 'IMAGE' ? '이미지형' : '링크형';
}

function toDateOnly(value: string | undefined) {
  return value?.slice(0, 10) ?? '';
}

function computeDaysLeft(endAt: string | undefined) {
  if (!endAt) {
    return null;
  }

  const diffMs = new Date(endAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/** 모집 기간이 이미 지났으면(종료) null, 아니면 D-day 계산값을 돌려준다 */
function computeParticipationDaysLeft(endAt: string | undefined) {
  if (!endAt) {
    return null;
  }

  const diffMs = new Date(endAt).getTime() - Date.now();
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;
}

function mapToMyQaRecruitItem(recruitment: MyQaRecruitment): MyQaRecruitItem {
  return {
    id: recruitment.id,
    title: recruitment.title,
    thumbnailUrl: recruitment.thumbnailInfo?.url ?? null,
    tags: recruitment.tags.map((tag) => PROJECT_TAG_LABEL[tag]),
    startDate: toDateOnly(recruitment.startAt),
    endDate: toDateOnly(recruitment.endAt),
    contentType: toContentType(recruitment.type),
    daysLeft:
      recruitment.status === 'RECRUITING'
        ? computeDaysLeft(recruitment.endAt)
        : null,
    rewardAcorn: recruitment.rewardAcorn,
    recruitedCount: Math.max(
      0,
      recruitment.slotCapacity - recruitment.remainSlot
    ),
    capacity: recruitment.slotCapacity,
  };
}

type SubmittedFeedbackProgress = FeedbackProgressApiResponse & {
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
};

function isSubmittedFeedbackProgress(
  response: FeedbackProgressApiResponse
): response is SubmittedFeedbackProgress {
  return (
    response.status === 'SUBMITTED' ||
    response.status === 'ACCEPTED' ||
    response.status === 'REJECTED'
  );
}

function mapToMyQaFeedbackReviewItem(
  response: SubmittedFeedbackProgress
): MyQaFeedbackReviewItem {
  const status = response.status === 'SUBMITTED' ? 'PENDING_REVIEW' : response.status;

  return {
    id: response.feedbackId,
    reviewerNickname: response.testerName ?? UNKNOWN_REVIEWER_NICKNAME,
    reviewerProfileImageUrl: normalizeImageUrl(response.testerProfileImageUrl),
    status,
    submittedAt: toDateOnly(response.submitAt),
    ...(status === 'PENDING_REVIEW'
      ? {
          responseDeadlineHoursLeft: computeResponseDeadlineHoursLeft(
            response.responseDeadlineAt
          ),
        }
      : {}),
  };
}

/**
 * 조회 API는 작성 중(WRITING)/취소(CANCELED)/만료(EXPIRED) 건도 함께 내려주지만,
 * 이 화면은 "제출된 피드백"만 다루므로 제출 완료 상태만 남긴다.
 */
function mapToMyQaFeedbackReviewItems(
  responses: FeedbackProgressApiResponse[]
): MyQaFeedbackReviewItem[] {
  return responses
    .filter(isSubmittedFeedbackProgress)
    .map(mapToMyQaFeedbackReviewItem);
}

function mapToMyQaRecruitDetail(
  feedbackPostId: string,
  detail: QaRecruitmentDetailResponse,
  feedbackReviews: MyQaFeedbackReviewItem[],
  authorNickname: string,
  authorProfileImageUrl: string | null
): MyQaRecruitDetail {
  const acceptedCount = feedbackReviews.filter(
    (review) => review.status === 'ACCEPTED'
  ).length;

  return {
    id: feedbackPostId,
    title: detail.title,
    thumbnailUrl:
      detail.images.find((image) => image.type === 'POST_THUMBNAIL')?.url ??
      null,
    tags: detail.tags.map((tag) => PROJECT_TAG_LABEL[tag]),
    startDate: toDateOnly(detail.startAt),
    endDate: toDateOnly(detail.endAt),
    contentType: toContentType(detail.targetType),
    status: detail.status,
    daysLeft:
      detail.status === 'RECRUITING' ? computeDaysLeft(detail.endAt) : null,
    rewardAcorn: detail.rewardAcorn,
    recruitedCount: Math.max(
      0,
      detail.slotCapacity - detail.remainSlotCount
    ),
    capacity: detail.slotCapacity,
    authorNickname,
    authorProfileImageUrl: normalizeImageUrl(authorProfileImageUrl),
    usedAcorn: detail.rewardAcorn * acceptedCount,
    feedbackReviews,
  };
}

function mapParticipationStatus(
  status: MyQaParticipation['status'],
  hasFiledObjection: boolean
): MypageParticipationStatus {
  switch (status) {
    case 'WRITING':
      return 'BEFORE_SUBMIT';
    case 'SUBMITTED':
      return 'PENDING_REVIEW';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'OBJECTED':
      return 'DISPUTE_REVIEWING';
    case 'OBJECTION_ACCEPTED':
    case 'OBJECTION_REJECTED':
      return 'DISPUTE_RESOLVED';
    case 'REJECTED':
      // 방금 이의제기를 접수했지만 백엔드 상태(OBJECTED)가 아직 반영되기 전인
      // 짧은 틈을 메우기 위한 낙관적 표시. 새로고침하면 실제 상태로 대체된다.
      return hasFiledObjection ? 'DISPUTE_REVIEWING' : 'REJECTED';
    case 'CANCELED':
    case 'EXPIRED':
    default:
      return 'NOT_SUBMITTED';
  }
}

/**
 * 이의제기 접수 직후에는 백엔드 상태가 OBJECTED로 바뀌기 전일 수 있어,
 * objectionStore의 접수 기록으로 "이의제기 검토 중"을 낙관적으로 보여준다.
 */
function mapToMyQaParticipationItem(
  participation: MyQaParticipation,
  hasFiledObjection: boolean
): MyQaParticipationItem {
  return {
    id: participation.id,
    feedbackPostId: participation.feedbackPostId,
    title: participation.title,
    thumbnailUrl: normalizeImageUrl(participation.thumbnail),
    status: mapParticipationStatus(participation.status, hasFiledObjection),
    startDate: toDateOnly(participation.startAt),
    endDate: toDateOnly(participation.endAt),
    contentType: toContentType(participation.targetType),
    daysLeft: computeParticipationDaysLeft(participation.endAt),
    completeDate: participation.completeAt
      ? toDateOnly(participation.completeAt)
      : null,
    rewardAcorn: participation.rewardAcorn,
  };
}

export {
  mapToMyQaFeedbackReviewItems,
  mapToMyQaParticipationItem,
  mapToMyQaRecruitDetail,
  mapToMyQaRecruitItem,
};
