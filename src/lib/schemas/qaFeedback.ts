import { z } from 'zod';

import type { QaFeedbackQuestion } from '@/types/qa';

const qaFeedbackAnswerSchema = z.object({
  selectedOptions: z.array(z.number().int().positive()),
  text: z.string(),
  image: z.custom<File | null>(
    (value) =>
      value === null ||
      (typeof File !== 'undefined' && value instanceof File),
    { message: '이미지를 다시 첨부해 주세요' }
  ),
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
        image: null,
      };

      if (question.type === 'SUBJECTIVE') {
        const text = answer.text.trim();
        const textPath = ['answers', String(question.order), 'text'];
        const imagePath = ['answers', String(question.order), 'image'];
        const hasAnswer = text.length > 0 || answer.image !== null;

        if ((question.isRequire || answer.image !== null) && text.length === 0) {
          context.addIssue({
            code: 'custom',
            path: textPath,
            message: '필수 질문이에요',
          });
        }

        if (
          text.length > 0 &&
          question.minimumLength != null &&
          text.length < question.minimumLength
        ) {
          context.addIssue({
            code: 'custom',
            path: textPath,
            message: `최소 ${question.minimumLength}자 이상 작성해 주세요`,
          });
        }

        if (
          question.allowImageAttachment &&
          (question.isRequire || hasAnswer) &&
          answer.image === null
        ) {
          context.addIssue({
            code: 'custom',
            path: imagePath,
            message: '답변을 설명할 이미지를 첨부해 주세요',
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
