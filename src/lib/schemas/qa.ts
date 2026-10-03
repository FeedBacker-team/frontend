import {
  addDays,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';
import { z } from 'zod';

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/constants/file';
import { QA_RECRUIT_TITLE_MAX_LENGTH } from '@/constants/qa';
import type {
  QaRecruitFormValues,
} from '@/types/qa';

const MAX_TEST_IMAGE_COUNT = 3;
const MIN_QUESTION_COUNT = 1;
const MAX_QUESTION_COUNT = 10;
const MIN_CHOICE_OPTION_COUNT = 2;
const MAX_CHOICE_OPTION_COUNT = 5;

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function isRecruitEndDate(value: string) {
  if (!value) {
    return true;
  }

  const date = startOfDay(parseISO(value));
  const today = startOfDay(new Date());
  const lastAvailableDate = addDays(today, 28);

  return (
    isValid(date) &&
    !isBefore(date, today) &&
    !isAfter(date, lastAvailableDate)
  );
}

const testImageSchema = z
  .custom<File>(
    (value) => typeof File !== 'undefined' && value instanceof File,
    '이미지 파일을 등록해 주세요'
  )
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: 'PNG, JPG 형식의 이미지만 등록할 수 있어요',
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE_BYTES, {
    message: '이미지는 파일당 최대 5MB까지 등록할 수 있어요',
  });

const qaRecruitQuestionSharedFields = {
  clientId: z.string().min(1),
  questionText: z.string().trim().min(1, '질문을 입력해 주세요'),
  isRequire: z.boolean(),
  allowImageAttachment: z.boolean(),
};

const choiceOptionsSchema = z
  .array(z.string().trim().min(1, '선택지 문구를 입력해 주세요'))
  .min(
    MIN_CHOICE_OPTION_COUNT,
    `선택지를 ${MIN_CHOICE_OPTION_COUNT}개 이상 추가해 주세요`
  )
  .max(
    MAX_CHOICE_OPTION_COUNT,
    `선택지는 최대 ${MAX_CHOICE_OPTION_COUNT}개까지 추가할 수 있어요`
  );

const singleChoiceQuestionSchema = z.object({
  ...qaRecruitQuestionSharedFields,
  type: z.literal('SINGLE_CHOICE'),
  options: choiceOptionsSchema,
  maxSelectionCount: z.literal(1),
  allowImageAttachment: z.literal(false),
});

const multipleChoiceQuestionSchema = z
  .object({
    ...qaRecruitQuestionSharedFields,
    type: z.literal('MULTIPLE_CHOICE'),
    options: choiceOptionsSchema,
    maxSelectionCount: z
      .number({ error: '최대 선택 개수를 확인해 주세요' })
      .int('최대 선택 개수는 정수여야 해요')
      .min(1, '최대 선택 개수는 1개 이상이어야 해요'),
    allowImageAttachment: z.literal(false),
  })
  .refine(
    (question) => question.maxSelectionCount <= question.options.length,
    {
      path: ['maxSelectionCount'],
      message: '최대 선택 개수는 전체 선택지 수보다 클 수 없어요',
    }
  );

const subjectiveQuestionSchema = z.object({
  ...qaRecruitQuestionSharedFields,
  type: z.literal('SUBJECTIVE'),
  minimumLength: z
    .number({ error: '최소 답변 글자 수를 확인해 주세요' })
    .int('최소 답변 글자 수는 정수여야 해요')
    .min(1, '최소 답변 글자 수는 1자 이상이어야 해요')
    .nullable(),
});

const qaRecruitQuestionSchema = z.discriminatedUnion('type', [
  singleChoiceQuestionSchema,
  multipleChoiceQuestionSchema,
  subjectiveQuestionSchema,
]);

const qaRecruitSharedFields = {
  projectId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해 주세요')
    .max(
      QA_RECRUIT_TITLE_MAX_LENGTH,
      `제목은 ${QA_RECRUIT_TITLE_MAX_LENGTH}자 이내로 입력해 주세요`
    ),
  description: z.string().trim().min(1, '설명을 입력해 주세요'),
  slotCapacity: z
    .number({ error: '모집 인원을 입력해 주세요' })
    .int('모집 인원은 정수로 입력해 주세요')
    .min(1, '모집 인원은 1명 이상이어야 해요')
    .max(50, '모집 인원은 최대 50명까지 설정할 수 있어요'),
  endAt: z
    .string()
    .min(1, '모집 종료일을 선택해 주세요')
    .refine(isRecruitEndDate, {
      message: '모집 종료일은 오늘부터 28일 이내로 선택해 주세요',
    }),
  questions: z
    .array(qaRecruitQuestionSchema)
    .min(
      MIN_QUESTION_COUNT,
      `질문을 ${MIN_QUESTION_COUNT}개 이상 추가해 주세요`
    )
    .max(
      MAX_QUESTION_COUNT,
      `질문은 최대 ${MAX_QUESTION_COUNT}개까지 추가할 수 있어요`
    ),
};

const qaRecruitServiceLinkSchema = z.object({
  ...qaRecruitSharedFields,
  target: z.literal('SERVICE_LINK'),
  serviceUrl: z
    .string()
    .trim()
    .min(1, '테스트 URL을 입력해 주세요')
    .refine((value) => value === '' || isHttpUrl(value), {
      message: 'http 또는 https로 시작하는 URL을 입력해 주세요',
    }),
  testImages: z
    .array(testImageSchema)
    .max(
      MAX_TEST_IMAGE_COUNT,
      `이미지는 최대 ${MAX_TEST_IMAGE_COUNT}개까지 등록할 수 있어요`
    ),
});

const qaRecruitImageSchema = z.object({
  ...qaRecruitSharedFields,
  target: z.literal('IMAGE'),
  serviceUrl: z.string(),
  testImages: z
    .array(testImageSchema)
    .min(1, '테스트 이미지를 1개 이상 등록해 주세요')
    .max(
      MAX_TEST_IMAGE_COUNT,
      `이미지는 최대 ${MAX_TEST_IMAGE_COUNT}개까지 등록할 수 있어요`
    ),
});

const qaRecruitFormSchema: z.ZodType<
  QaRecruitFormValues,
  QaRecruitFormValues
> = z.discriminatedUnion('target', [
  qaRecruitServiceLinkSchema,
  qaRecruitImageSchema,
]);

export { qaRecruitFormSchema, qaRecruitQuestionSchema };
