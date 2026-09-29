import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { uploadQaImages } from '@/apis/file';
import {
  createQaRecruitment,
  getQaFeedbackForm,
  getQaRecruitmentDetail,
  getQaRecruitments,
  participateInQa,
  submitQaFeedback,
} from '@/apis/qa';
import { buildSubmitQaFeedbackRequest } from '@/lib/qa/feedback';
import { buildQaRecruitmentRequest } from '@/lib/qa/recruit';
import type {
  QaFeedbackFormValues,
  QaFeedbackQuestion,
  QaRecruitFormValues,
  QaRecruitmentListParams,
} from '@/types/qa';

const qaRecruitmentKeys = {
  all: ['qa-recruitments'] as const,
  list: (params: QaRecruitmentListParams) =>
    [...qaRecruitmentKeys.all, 'list', params] as const,
  detail: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'detail', feedbackPostId] as const,
  feedbackForm: (feedbackPostId: string) =>
    [...qaRecruitmentKeys.all, 'feedback-form', feedbackPostId] as const,
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

function useQaFeedbackForm(feedbackPostId: string) {
  return useQuery({
    queryKey: qaRecruitmentKeys.feedbackForm(feedbackPostId),
    queryFn: ({ signal }) => getQaFeedbackForm(feedbackPostId, signal),
  });
}

async function submitQaRecruitment(values: QaRecruitFormValues) {
  const uploadedPaths =
    values.target === 'IMAGE'
      ? await uploadQaImages(values.testImages)
      : [];
  const request = buildQaRecruitmentRequest(values, uploadedPaths);

  return createQaRecruitment(request);
}

function useCreateQaRecruitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQaRecruitment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qaRecruitmentKeys.all }),
  });
}

function useParticipateInQa(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => participateInQa(feedbackPostId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: qaRecruitmentKeys.detail(feedbackPostId),
      }),
  });
}

type SubmitQaFeedbackVariables = {
  questions: QaFeedbackQuestion[];
  values: QaFeedbackFormValues;
};

function useSubmitQaFeedback(feedbackPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questions, values }: SubmitQaFeedbackVariables) =>
      submitQaFeedback(
        buildSubmitQaFeedbackRequest(feedbackPostId, questions, values)
      ),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: qaRecruitmentKeys.feedbackForm(feedbackPostId),
      });

      return queryClient.invalidateQueries({
        queryKey: qaRecruitmentKeys.detail(feedbackPostId),
      });
    },
  });
}

export {
  qaRecruitmentKeys,
  useCreateQaRecruitment,
  useParticipateInQa,
  useQaFeedbackForm,
  useQaRecruitmentDetail,
  useQaRecruitments,
  useSubmitQaFeedback,
};
