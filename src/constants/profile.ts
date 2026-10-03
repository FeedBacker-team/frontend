const PROFILE_NICKNAME_MAX_LENGTH = 10;

const PROFILE_JOBS = [
  { value: 'DEVELOPER', label: '개발자' },
  { value: 'DESIGNER', label: '디자이너' },
  { value: 'PLANNER', label: '기획자' },
  { value: 'SOLO_DEV', label: '1인 개발자' },
  { value: 'OTHER', label: '기타' },
] as const;

const PROFILE_ROLE_LABEL = Object.fromEntries(
  PROFILE_JOBS.map(({ value, label }) => [value, label])
) as Record<(typeof PROFILE_JOBS)[number]['value'], string>;

export {
  PROFILE_JOBS,
  PROFILE_NICKNAME_MAX_LENGTH,
  PROFILE_ROLE_LABEL,
};
