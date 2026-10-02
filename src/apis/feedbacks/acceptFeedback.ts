import { feedbackRequest } from './request';

function buildAcceptFeedbackPath(feedbackId: string) {
  return `/api/feedbacks/${encodeURIComponent(feedbackId)}/accept`;
}

async function acceptFeedback(feedbackId: string): Promise<void> {
  return feedbackRequest<void>(buildAcceptFeedbackPath(feedbackId), {
    method: 'PATCH',
    responseType: 'void',
    fallbackMessage: '피드백 수락에 실패했습니다',
  });
}

export { acceptFeedback };
