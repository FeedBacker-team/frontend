import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { uploadImages } from '@/apis/images';
import {
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
} from '@/apis/qa';
import { buildSubmitQaFeedbackRequest } from '@/lib/qa/feedback';
import {
  mapToMyQaFeedbackReviewItems,
  mapToMyQaRecruitDetail,
} from '@/lib/qa/myQa';
import { buildQaRecruitmentRequest } from '@/lib/qa/recruit';
import { mapToMyQaResultDetail } from '@/lib/qa/result';
import { profileKeys, useProfile } from '@/hooks/useProfile';
import type {
  QaFeedbackFormValues,
  QaFeedbackQuestion,
  QaRecruitFormValues,
  QaRecruitmentCard,
  QaRecruitmentListParams,
} from '@/types/qa';

const QA_REWARD_RANKING_SIZE = 5;
const QA_REWARD_RANKING_PAGE_SIZE = 50;

const qaRecruitmentKeys = {
  all: ['qa-recruitments'] as const,
  list: (params: QaRecruitmentListParams) =>
    [...qaRecruitmentKeys.all, 'list', params] as const,
  detail: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'detail', feedbackPostId] as const,
  feedbackForm: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'feedback-form', feedbackPostId] as const,
  feedbackReviews: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'feedback-reviews', feedbackPostId] as const,
  result: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'result', feedbackPostId] as const,
  mine: () => [...qaRecruitmentKeys.all, 'mine'] as const,
  myParticipations: () =>
    [...qaRecruitmentKeys.all, 'my-participations'] as const,
  rewardRanking: () =>
    [...qaRecruitmentKeys.all, 'reward-ranking'] as const,
};

type QaStatusQueryOptions = {
  enabled?: boolean;
};

function useQaRecruitments(params: QaRecruitmentListParams = {}) {
  return useQuery({
    queryKey: qaRecruitmentKeys.list(params),
    queryFn: ({ signal }) => getQaRecruitments(params, signal),
  });
}

function useQaRecruitmentDetail(feedbackPostId: string) {
  return useQuery({
    queryKey: qaRecruitmentKeys.detail(feedbackPostId),
    queryFn: ({ signal }) =>
      getQaRecruitmentDetail(feedbackPostId, signal),
  });
}

function useMyQaFeedbackReviewList(feedbackPostId: string) {
  return useQuery({
    queryKey: qaRecruitmentKeys.feedbackReviews(feedbackPostId),
    queryFn: ({ signal }) => getFeedbackProgressList(feedbackPostId, signal),
    select: mapToMyQaFeedbackReviewItems,
  });
}

/**
 * 메이커가 보는 "QA 진행 상황" 화면용 상세 정보.
 * 모집글 상세, 제출된 피드백 목록, 작성자(본인) 닉네임 세 요청을 합쳐
 * MyQaRecruitDetail 하나로 만들어 반환한다.
 */
function useMyQaRecruitDetail(feedbackPostId: string) {
  const detailQuery = useQaRecruitmentDetail(feedbackPostId);
  const reviewListQuery = useMyQaFeedbackReviewList(feedbackPostId);
  const profileQuery = useProfile();

  const data =
    detailQuery.data && reviewListQuery.data && profileQuery.data
      ? mapToMyQaRecruitDetail(
          feedbackPostId,
          detailQuery.data,
          reviewListQuery.data,
          profileQuery.data.nickname
        )
      : undefined;

  return {
    data,
    isPending:
      detailQuery.isPending ||
      reviewListQuery.isPending ||
      profileQuery.isPending,
    isError: detailQuery.isError || reviewListQuery.isError,
    error: detailQuery.error ?? reviewListQuery.error ?? null,
    refetch: () => {
      void detailQuery.refetch();
      void reviewListQuery.refetch();
    },
  };
}

/**
 * 메이커가 QA완료 처리 후 보는 "QA 결과" 화면용 상세 정보.
 * 모집글 총 결과, 작성 폼 설정(문항 필수 여부·단일/다중 선택 여부), 보유 도토리
 * 세 요청을 합쳐 MyQaResultDetail 하나로 만들어 반환한다.
 */
function useMyQaResultDetail(feedbackPostId: string) {
  const resultQuery = useQuery({
    queryKey: qaRecruitmentKeys.result(feedbackPostId),
    queryFn: ({ signal }) => getQaResult(feedbackPostId, signal),
  });
  const formQuery = useQaFeedbackForm(feedbackPostId);
  const profileQuery = useProfile();

  const data =
    resultQuery.data && formQuery.data && profileQuery.data
      ? mapToMyQaResultDetail(
          feedbackPostId,
          resultQuery.data,
          formQuery.data,
          profileQuery.data
        )
      : undefined;

  return {
    data,
    isPending:
      resultQuery.isPending || formQuery.isPending || profileQuery.isPending,
    isError: resultQuery.isError || formQuery.isError,
    error: resultQuery.error ?? formQuery.error ?? null,
    refetch: () => {
      void resultQuery.refetch();
      void formQuery.refetch();
    },
  };
}

function useQaFeedbackForm(feedbackPostId: string) {
  return useQuery({
    queryKey: qaRecruitmentKeys.feedbackForm(feedbackPostId),
    queryFn: ({ signal }) => getQaFeedbackForm(feedbackPostId, signal),
  });
}

function useMyQaRecruitments({ enabled = true }: QaStatusQueryOptions = {}) {
  return useQuery({
    queryKey: qaRecruitmentKeys.mine(),
    queryFn: ({ signal }) => getMyQaRecruitments(signal),
    enabled,
  });
}

function useMyQaParticipations({ enabled = true }: QaStatusQueryOptions = {}) {
  return useQuery({
    queryKey: qaRecruitmentKeys.myParticipations(),
    queryFn: ({ signal }) => getMyQaParticipations(signal),
    enabled,
  });
}

async function getQaRewardRanking(signal?: AbortSignal) {
  const qas: QaRecruitmentCard[] = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await getQaRecruitments(
      {
        sort: 'LATEST',
        page,
        size: QA_REWARD_RANKING_PAGE_SIZE,
      },
      signal
    );

    qas.push(...response.feedbackPosts);
    hasNext = response.hasNext;
    page += 1;
  }

  return qas
    .sort(
      (a, b) =>
        b.requiredAcorns / b.capacity - a.requiredAcorns / a.capacity
    )
    .slice(0, QA_REWARD_RANKING_SIZE);
}

function useQaRewardRanking() {
  return useQuery({
    queryKey: qaRecruitmentKeys.rewardRanking(),
    queryFn: ({ signal }) => getQaRewardRanking(signal),
  });
}

async function submitQaRecruitment(values: QaRecruitFormValues) {
  const uploadedPaths =
    values.target === 'IMAGE'
      ? await uploadImages(values.testImages)
      : [];
  const request = buildQaRecruitmentRequest(values, uploadedPaths);

  return createQaRecruitment(request);
}

function useCreateQaRecruitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQaRecruitment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: qaRecruitmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
      ]);
    },
  });
}

function useParticipateInQa(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => participateInQa(feedbackPostId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: qaRecruitmentKeys.all });
    },
  });
}

function useGiveUpQaParticipation(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => giveUpQaParticipation(feedbackPostId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.detail(feedbackPostId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.myParticipations(),
        }),
        queryClient.invalidateQueries({
          queryKey: [...qaRecruitmentKeys.all, 'list'],
        }),
      ]);
    },
  });
}

function useCompleteQaRecruitment(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeQaRecruitment(feedbackPostId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: qaRecruitmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
      ]);
    },
  });
}

type SubmitQaFeedbackVariables = {
  questions: QaFeedbackQuestion[];
  values: QaFeedbackFormValues;
};

function useSubmitQaFeedback(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questions, values }: SubmitQaFeedbackVariables) => {
      const imageAnswers = questions.flatMap((question) => {
        if (question.type !== 'SUBJECTIVE') {
          return [];
        }

        const image = values.answers[String(question.order)]?.image;

        return image ? [{ order: question.order, image }] : [];
      });
      const uploadedPaths =
        imageAnswers.length > 0
          ? await uploadImages(imageAnswers.map(({ image }) => image))
          : [];

      if (uploadedPaths.length !== imageAnswers.length) {
        throw new Error('피드백 이미지 업로드 결과를 확인해 주세요.');
      }

      const uploadedImagePaths = Object.fromEntries(
        imageAnswers.map(({ order }, index) => [
          order,
          uploadedPaths[index] ? [uploadedPaths[index]] : [],
        ])
      );

      return submitQaFeedback(
        buildSubmitQaFeedbackRequest(
          feedbackPostId,
          questions,
          values,
          uploadedImagePaths
        )
      );
    },
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: qaRecruitmentKeys.feedbackForm(feedbackPostId),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.detail(feedbackPostId),
        }),
        queryClient.invalidateQueries({
          queryKey: qaRecruitmentKeys.myParticipations(),
        }),
      ]);
    },
  });
}

export {
  qaRecruitmentKeys,
  useCompleteQaRecruitment,
  useCreateQaRecruitment,
  useGiveUpQaParticipation,
  useMyQaFeedbackReviewList,
  useMyQaParticipations,
  useMyQaRecruitDetail,
  useMyQaRecruitments,
  useMyQaResultDetail,
  useParticipateInQa,
  useQaFeedbackForm,
  useQaRecruitmentDetail,
  useQaRecruitments,
  useQaRewardRanking,
  useSubmitQaFeedback,
};
