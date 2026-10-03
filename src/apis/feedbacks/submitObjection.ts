import { feedbackRequest } from './request';

import type { ObjectType } from '@/types/mypage';

function buildObjectionPath(feedbackId: string) {
  return `/api/feedbacks/${encodeURIComponent(feedbackId)}/objection`;
}

type SubmitObjectionRequest = {
  objectType: ObjectType;
  objectReason: string;
};

async function submitObjection(
  feedbackId: string,
  body: SubmitObjectionRequest
): Promise<void> {
  return feedbackRequest<void>(buildObjectionPath(feedbackId), {
    method: 'PATCH',
    json: body,
    responseType: 'void',
    fallbackMessage: '이의제기 접수에 실패했습니다',
  });
}

export { submitObjection };
export type { SubmitObjectionRequest };
