import { z } from 'zod';

import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TAGS,
  PROJECT_TITLE_MAX_LENGTH,
  PROJECT_URL_MAX_LENGTH,
} from '@/constants/project';
import type { ProjectTag } from '@/types/project';

const [firstTag, ...restTags] = PROJECT_TAGS.map((tag) => tag.value);

const projectTagSchema = z.enum([firstTag, ...restTags] as [
  ProjectTag,
  ...ProjectTag[],
]);

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해 주세요')
    .max(
      PROJECT_TITLE_MAX_LENGTH,
      `제목은 ${PROJECT_TITLE_MAX_LENGTH}자 이내로 입력해 주세요`
    ),
  description: z
    .string()
    .trim()
    .min(1, '설명을 입력해 주세요')
    .max(
      PROJECT_DESCRIPTION_MAX_LENGTH,
      `설명은 ${PROJECT_DESCRIPTION_MAX_LENGTH}자 이내로 입력해 주세요`
    ),
  tags: z.array(projectTagSchema),
  url: z
    .string()
    .trim()
    .min(1, '프로젝트 URL을 입력해 주세요')
    .max(PROJECT_URL_MAX_LENGTH)
    .refine(isHttpUrl, { message: '올바른 URL 형식을 입력해 주세요' }),
});

type ProjectRegisterFormValues = z.infer<typeof projectFormSchema>;

export { projectFormSchema };
export type { ProjectRegisterFormValues };
