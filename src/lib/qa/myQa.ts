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
    reviewerNickname:
      response.nickname ?? response.testerName ?? UNKNOWN_REVIEWER_NICKNAME,
    reviewerProfileImageUrl: normalizeImageUrl(response.profileImage),
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
  authorNickname: string
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
    usedAcorn: detail.rewardAcorn * acceptedCount,
    feedbackReviews,
  };
}

function mapParticipationStatus(
  status: MyQaParticipation['status'],
  hasFiledObjection: boolean
): MypageParticipationStatus {
  if (status === 'REJECTED' && hasFiledObjection) {
    return 'DISPUTE_REVIEWING';
  }

  switch (status) {
    case 'WRITING':
      return 'BEFORE_SUBMIT';
    case 'SUBMITTED':
      return 'PENDING_REVIEW';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'REJECTED':
      return 'REJECTED';
    case 'CANCELED':
    case 'EXPIRED':
    default:
      return 'NOT_SUBMITTED';
  }
}

/**
 * 이의제기 접수/검토 상태는 백엔드 데이터 모델에 없어 조회할 수 없다(ERD 기준).
 * 그래서 이의제기를 접수하면 현재 세션의 objectionStore에만 표시해, 접수 직후
 * 목록에서 "이의제기 검토 중"으로 보이게 하는 클라이언트 전용 연출이다.
 */
function mapToMyQaParticipationItem(
  participation: MyQaParticipation,
  hasFiledObjection: boolean
): MyQaParticipationItem {
  return {
    id: participation.id,
    title: participation.title,
    status: mapParticipationStatus(participation.status, hasFiledObjection),
    // 이 API 응답에는 모집 기간/콘텐츠 타입이 없다. feedbackPostId가 추가되면
    // getQaRecruitmentDetail(feedbackPostId)로 조회해 채우는 방식으로 교체한다.
    startDate: '',
    endDate: '',
    contentType: '링크형',
    daysLeft: null,
    rewardAcorn: participation.rewardAcorn,
  };
}

export {
  mapToMyQaFeedbackReviewItems,
  mapToMyQaParticipationItem,
  mapToMyQaRecruitDetail,
  mapToMyQaRecruitItem,
};
