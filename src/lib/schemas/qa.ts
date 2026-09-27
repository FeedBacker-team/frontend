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
import type {
  QaRecruitFormValues,
  QaRecruitQuestionFormValue,
} from '@/types/qa';

const MAX_TEST_IMAGE_COUNT = 3;

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

const qaRecruitSharedFields = {
  projectId: z.string().min(1),
  title: z.string().trim().min(1, '제목을 입력해 주세요'),
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
  questions: z.array(z.custom<QaRecruitQuestionFormValue>()),
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

export { qaRecruitFormSchema };
