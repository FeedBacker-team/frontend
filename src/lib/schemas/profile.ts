import { z } from 'zod';

import {
  PROFILE_INTEREST_TAGS,
  PROFILE_JOBS,
  PROFILE_NICKNAME_MAX_LENGTH,
} from '@/constants/profile';

const [firstRole, ...restRoles] = PROFILE_JOBS.map((job) => job.value);
const [firstInterest, ...restInterests] = PROFILE_INTEREST_TAGS.map(
  (tag) => tag.value
);

const profileRoleSchema = z.enum([firstRole, ...restRoles], {
  error: '직군을 선택해 주세요',
});

const profileInterestSchema = z.enum([firstInterest, ...restInterests]);

const introLinkSchema = z.string().trim().refine(
  (value) => value === '' || z.url().safeParse(value).success,
  { message: '올바른 URL 형식을 입력해 주세요' }
);

const profileCompleteSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '닉네임을 입력해 주세요')
    .max(PROFILE_NICKNAME_MAX_LENGTH, '닉네임은 10자 이내로 입력해 주세요'),
  role: profileRoleSchema,
  intro_link: introLinkSchema,
  interests: z.array(profileInterestSchema),
});

type ProfileCompleteFormValues = z.infer<typeof profileCompleteSchema>;

export { profileCompleteSchema, profileInterestSchema, profileRoleSchema };
export type { ProfileCompleteFormValues };
