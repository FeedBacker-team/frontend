import { z } from 'zod';

import type { QaFeedbackQuestion } from '@/types/qa';

const qaFeedbackAnswerSchema = z.object({
  selectedOptions: z.array(z.number().int().positive()),
  text: z.string(),
});

const qaFeedbackFormValuesSchema = z.object({
  answers: z.record(z.string(), qaFeedbackAnswerSchema),
});

function createQaFeedbackFormSchema(questions: QaFeedbackQuestion[]) {
  return qaFeedbackFormValuesSchema.superRefine((values, context) => {
    questions.forEach((question) => {
      const answer = values.answers[String(question.order)] ?? {
        selectedOptions: [],
        text: '',
      };

      if (question.type === 'SUBJECTIVE') {
        const text = answer.text.trim();
        const path = ['answers', String(question.order), 'text'];

        if (question.isRequire && text.length === 0) {
          context.addIssue({
            code: 'custom',
            path,
            message: '필수 질문이에요',
          });
          return;
        }

        if (
          text.length > 0 &&
          question.minimumLength != null &&
          text.length < question.minimumLength
        ) {
          context.addIssue({
            code: 'custom',
            path,
            message: `최소 ${question.minimumLength}자 이상 작성해 주세요`,
          });
        }

        return;
      }

      const path = ['answers', String(question.order), 'selectedOptions'];
      const hasInvalidOption = answer.selectedOptions.some(
        (option) => option < 1 || option > question.optionText.length
      );

      if (question.isRequire && answer.selectedOptions.length === 0) {
        context.addIssue({
          code: 'custom',
          path,
          message: '필수 질문이에요',
        });
      } else if (hasInvalidOption) {
        context.addIssue({
          code: 'custom',
          path,
          message: '선택지를 다시 확인해 주세요',
        });
      } else if (
        answer.selectedOptions.length > question.maxSelectionCount
      ) {
        context.addIssue({
          code: 'custom',
          path,
          message: `최대 ${question.maxSelectionCount}개까지 선택할 수 있어요`,
        });
      }
    });
  });
}

export {
  createQaFeedbackFormSchema,
  qaFeedbackAnswerSchema,
  qaFeedbackFormValuesSchema,
};
