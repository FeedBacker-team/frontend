import { z } from 'zod';

import { qaFeedbackFormValuesSchema } from '@/lib/schemas/qaFeedback';
import type { QaFeedbackFormValues } from '@/types/qa';

const QA_FEEDBACK_DRAFT_VERSION = 1;
const QA_FEEDBACK_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const QA_FEEDBACK_DRAFT_KEY_PREFIX = 'feedbacker:qa-feedback-draft';

const qaFeedbackDraftSchema = z.object({
  version: z.literal(QA_FEEDBACK_DRAFT_VERSION),
  feedbackPostId: z.string(),
  userId: z.string(),
  updatedAt: z.number(),
  expiresAt: z.number(),
  values: qaFeedbackFormValuesSchema,
});

type QaFeedbackDraft = z.infer<typeof qaFeedbackDraftSchema>;

function normalizeStoredDraft(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value;
  }

  const draft = value as Record<string, unknown>;
  const values = draft.values;

  if (
    typeof values !== 'object' ||
    values === null ||
    Array.isArray(values)
  ) {
    return value;
  }

  const answers = (values as Record<string, unknown>).answers;

  if (
    typeof answers !== 'object' ||
    answers === null ||
    Array.isArray(answers)
  ) {
    return value;
  }

  return {
    ...draft,
    values: {
      ...values,
      answers: Object.fromEntries(
        Object.entries(answers).map(([order, answer]) => [
          order,
          typeof answer === 'object' && answer !== null && !Array.isArray(answer)
            ? { ...answer, image: null }
            : answer,
        ])
      ),
    },
  };
}

function getQaFeedbackDraftKey(feedbackPostId: string, userId: string) {
  return `${QA_FEEDBACK_DRAFT_KEY_PREFIX}:v${QA_FEEDBACK_DRAFT_VERSION}:${userId}:${feedbackPostId}`;
}

function removeQaFeedbackDraft(feedbackPostId: string, userId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(
      getQaFeedbackDraftKey(feedbackPostId, userId)
    );
  } catch {
    // 저장소 접근이 차단된 환경에서는 메모리의 폼 상태만 유지한다.
  }
}

function loadQaFeedbackDraft(
  feedbackPostId: string,
  userId: string
): QaFeedbackDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const key = getQaFeedbackDraftKey(feedbackPostId, userId);

  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return null;
    }

    const result = qaFeedbackDraftSchema.safeParse(
      normalizeStoredDraft(JSON.parse(storedValue))
    );

    if (
      !result.success ||
      result.data.feedbackPostId !== feedbackPostId ||
      result.data.userId !== userId ||
      result.data.expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(key);
      return null;
    }

    return result.data;
  } catch {
    removeQaFeedbackDraft(feedbackPostId, userId);
    return null;
  }
}

type SaveQaFeedbackDraftParams = {
  feedbackPostId: string;
  userId: string;
  values: QaFeedbackFormValues;
  expiresAt: number;
};

function saveQaFeedbackDraft({
  feedbackPostId,
  userId,
  values,
  expiresAt,
}: SaveQaFeedbackDraftParams) {
  if (typeof window === 'undefined' || expiresAt <= Date.now()) {
    return;
  }

  const draft: QaFeedbackDraft = {
    version: QA_FEEDBACK_DRAFT_VERSION,
    feedbackPostId,
    userId,
    updatedAt: Date.now(),
    expiresAt,
    values: {
      answers: Object.fromEntries(
        Object.entries(values.answers).map(([order, answer]) => [
          order,
          { ...answer, image: null },
        ])
      ),
    },
  };

  try {
    window.localStorage.setItem(
      getQaFeedbackDraftKey(feedbackPostId, userId),
      JSON.stringify(draft)
    );
  } catch {
    // 저장 용량 초과 또는 저장소 차단 시 입력 자체는 계속할 수 있게 한다.
  }
}

export {
  loadQaFeedbackDraft,
  QA_FEEDBACK_DRAFT_TTL_MS,
  removeQaFeedbackDraft,
  saveQaFeedbackDraft,
};
export type { QaFeedbackDraft };
