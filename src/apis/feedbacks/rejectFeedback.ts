import { feedbackRequest } from './request';

function buildRejectFeedbackPath(feedbackId: string) {
  return `/api/feedbacks/${encodeURIComponent(feedbackId)}/reject`;
}

type RejectFeedbackRequest = {
  rejectType: string;
  rejectDetail: string;
};

async function rejectFeedback(
  feedbackId: string,
  body: RejectFeedbackRequest
): Promise<void> {
  return feedbackRequest<void>(buildRejectFeedbackPath(feedbackId), {
    method: 'PATCH',
    json: body,
    responseType: 'void',
    fallbackMessage: '피드백 거절에 실패했습니다',
  });
}

export { rejectFeedback };
export type { RejectFeedbackRequest };
