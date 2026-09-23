import { PROJECT_TAGS } from '@/constants/project';

const PROFILE_NICKNAME_MAX_LENGTH = 10;

const PROFILE_JOBS = [
  { value: 'DEVELOPER', label: '개발자' },
  { value: 'DESIGNER', label: '디자이너' },
  { value: 'PLANNER', label: '기획자' },
  { value: 'SOLO_DEV', label: '1인 개발자' },
  { value: 'OTHER', label: '기타' },
] as const;

const PROFILE_INTEREST_TAGS = PROJECT_TAGS;

export {
  PROFILE_INTEREST_TAGS,
  PROFILE_JOBS,
  PROFILE_NICKNAME_MAX_LENGTH,
};
