import type { ProjectSort, ProjectTag } from '@/types/project';

const PROJECT_TAGS: { value: ProjectTag; label: string }[] = [
  { value: 'WEB', label: '# 웹' },
  { value: 'APP', label: '# 앱' },
  { value: 'AI_ML', label: '# AI · ML' },
  { value: 'DATA', label: '# 데이터' },
  { value: 'CLOUD', label: '# 클라우드' },
  { value: 'COMMERCE', label: '# 커머스' },
  { value: 'FINTECH', label: '# 핀테크' },
  { value: 'B2B_SAAS', label: '# B2B · SaaS' },
  { value: 'CONTENT_MEDIA', label: '# 콘텐츠 · 미디어' },
  { value: 'GAME', label: '# 게임' },
  { value: 'UXUI', label: '# UXUI' },
  { value: 'SECURITY', label: '# 보안' },
  { value: 'PRODUCTIVITY', label: '# 생산성' },
  { value: 'HEALTHCARE', label: '# 헬스케어' },
  { value: 'GLOBAL', label: '# 글로벌' },
];

const PROJECT_SORT_OPTIONS: { value: ProjectSort; label: string }[] = [
  { value: 'LATEST', label: '최신순' },
  { value: 'VIEW_COUNT', label: '조회수 순' },
];

const DEFAULT_PROJECT_PAGE_SIZE = 12;
const BROWSE_PROJECT_PAGE_SIZE = 5;
const RANKING_PROJECT_PAGE_SIZE = 5;

const PROJECT_TAG_LABEL = Object.fromEntries(
  PROJECT_TAGS.map(({ value, label }) => [value, label])
) as Record<ProjectTag, string>;

export {
  BROWSE_PROJECT_PAGE_SIZE,
  DEFAULT_PROJECT_PAGE_SIZE,
  PROJECT_SORT_OPTIONS,
  PROJECT_TAG_LABEL,
  PROJECT_TAGS,
  RANKING_PROJECT_PAGE_SIZE,
};
