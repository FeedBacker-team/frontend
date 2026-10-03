import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptFeedback,
  getFeedbackDetail,
  rejectFeedback,
  submitObjection,
} from '@/apis/feedbacks';
import type { RejectFeedbackRequest } from '@/apis/feedbacks';
import { getQaFeedbackForm } from '@/apis/qa';
import { OBJECTION_REASONS } from '@/constants/mypage';
import { qaRecruitmentKeys } from '@/hooks/useQaRecruitments';
import {
  mapFeedbackDetailToParticipationDetail,
  mapFeedbackDetailToReviewDetail,
} from '@/lib/feedback';
import type { ChoiceQuestionMeta } from '@/lib/feedback';
import { useObjectionStore } from '@/stores/objectionStore';
import type { ObjectionReasonValue } from '@/types/mypage';

const feedbackKeys = {
  all: ['feedbacks'] as const,
  reviewDetail: (feedbackId: string) =>
    [...feedbackKeys.all, 'review-detail', feedbackId] as const,
  participationDetail: (feedbackId: string) =>
    [...feedbackKeys.all, 'participation-detail', feedbackId] as const,
};

/**
 * 상세보기 응답은 객관식 문항의 단일/다중 선택 여부와 각 문항의 필수 여부를 알려주지 않는다.
 * 모집글 작성 폼 설정(maxSelectionCount, isRequire)을 같이 조회해 order로 대조한다.
 * 조회에 실패해도 상세 화면 자체는 보여줘야 하므로 실패는 무시하고 undefined를 반환한다.
 */
async function getQuestionFormMeta(feedbackPostId: string, signal?: AbortSignal) {
  try {
    const form = await getQaFeedbackForm(feedbackPostId, signal);
    const choiceMeta = new Map<number, ChoiceQuestionMeta>(
      form.choiceQuestionResponses.map((question) => [
        question.order,
        {
          isRequire: question.isRequire,
          maxSelectionCount: question.maxSelectionCount,
        },
      ])
    );
    const subjectiveRequired = new Map<number, boolean>(
      form.subjectiveQuestionResponses.map((question) => [
        question.order,
        question.isRequire,
      ])
    );

    return { choiceMeta, subjectiveRequired };
  } catch {
    return undefined;
  }
}

function useFeedbackDetail(feedbackPostId: string, feedbackId: string) {
  return useQuery({
    queryKey: feedbackKeys.reviewDetail(feedbackId),
    queryFn: async ({ signal }) => {
      const [response, formMeta] = await Promise.all([
        getFeedbackDetail(feedbackId, signal),
        getQuestionFormMeta(feedbackPostId, signal),
      ]);

      return mapFeedbackDetailToReviewDetail(
        feedbackPostId,
        feedbackId,
        response,
        formMeta?.choiceMeta,
        formMeta?.subjectiveRequired
      );
    },
  });
}

function useAcceptFeedback(feedbackPostId: string, feedbackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptFeedback(feedbackId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: feedbackKeys.reviewDetail(feedbackId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.feedbackReviews(feedbackPostId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.detail(feedbackPostId),
        }),
      ]),
  });
}

function useRejectFeedback(feedbackPostId: string, feedbackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RejectFeedbackRequest) =>
      rejectFeedback(feedbackId, body),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: feedbackKeys.reviewDetail(feedbackId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.feedbackReviews(feedbackPostId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.detail(feedbackPostId),
        }),
      ]),
  });
}

/**
 * 거절당한 피드백을 테스터 본인이 보는 화면(이의제기 작성, 참여 상세 모달)용 조회.
 * objectionStore에 접수 기록이 있으면 "이의제기 검토 중" 상태로 보여준다.
 */
function useFeedbackParticipationDetail(feedbackId: string | null) {
  const filedObjection = useObjectionStore((state) =>
    feedbackId ? state.filedByFeedbackId[feedbackId] : undefined
  );

  return useQuery({
    queryKey: feedbackKeys.participationDetail(feedbackId ?? ''),
    queryFn: async ({ signal }) => {
      const response = await getFeedbackDetail(feedbackId as string, signal);
      return mapFeedbackDetailToParticipationDetail(
        feedbackId as string,
        response,
        filedObjection
      );
    },
    enabled: feedbackId !== null,
  });
}

type SubmitObjectionInput = {
  reason: ObjectionReasonValue;
  detailReason: string;
};

function buildObjectReason({ reason, detailReason }: SubmitObjectionInput) {
  const label =
    OBJECTION_REASONS.find((item) => item.value === reason)?.label ?? reason;

  return `${label}\n${detailReason}`;
}

function useSubmitObjection(feedbackId: string) {
  const markObjectionFiled = useObjectionStore(
    (state) => state.markObjectionFiled
  );

  return useMutation({
    mutationFn: (input: SubmitObjectionInput) =>
      submitObjection(feedbackId, { objectReason: buildObjectReason(input) }),
    onSuccess: (_data, input) => {
      markObjectionFiled(feedbackId, {
        reason: input.reason,
        detailReason: input.detailReason.trim(),
        submittedAt: new Date().toISOString().slice(0, 10),
      });
    },
  });
}

export {
  feedbackKeys,
  useAcceptFeedback,
  useFeedbackDetail,
  useFeedbackParticipationDetail,
  useRejectFeedback,
  useSubmitObjection,
};
export type { SubmitObjectionInput };
