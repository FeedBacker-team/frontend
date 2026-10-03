import { z } from 'zod';

import { projectDraftValuesSchema } from '@/lib/schemas/project';
import type { ProjectDraftValues } from '@/lib/schemas/project';

const PROJECT_DRAFT_VERSION = 1;
const PROJECT_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const PROJECT_DRAFT_KEY_PREFIX = 'feedbacker:project-draft';

const projectDraftSchema = z.object({
  version: z.literal(PROJECT_DRAFT_VERSION),
  userId: z.string(),
  updatedAt: z.number(),
  expiresAt: z.number(),
  values: projectDraftValuesSchema,
});

type ProjectDraft = z.infer<typeof projectDraftSchema>;

function getProjectDraftKey(userId: string) {
  return `${PROJECT_DRAFT_KEY_PREFIX}:v${PROJECT_DRAFT_VERSION}:${userId}`;
}

function removeProjectDraft(userId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(getProjectDraftKey(userId));
  } catch {
    // 저장소 접근이 차단된 환경에서는 메모리의 폼 상태만 유지한다.
  }
}

function loadProjectDraft(userId: string): ProjectDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const key = getProjectDraftKey(userId);

  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return null;
    }

    const result = projectDraftSchema.safeParse(JSON.parse(storedValue));

    if (
      !result.success ||
      result.data.userId !== userId ||
      result.data.expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(key);
      return null;
    }

    return result.data;
  } catch {
    removeProjectDraft(userId);
    return null;
  }
}

type SaveProjectDraftParams = {
  userId: string;
  values: ProjectDraftValues;
  expiresAt: number;
};

function saveProjectDraft({
  userId,
  values,
  expiresAt,
}: SaveProjectDraftParams) {
  if (typeof window === 'undefined' || expiresAt <= Date.now()) {
    return;
  }

  const draft: ProjectDraft = {
    version: PROJECT_DRAFT_VERSION,
    userId,
    updatedAt: Date.now(),
    expiresAt,
    values,
  };

  try {
    window.localStorage.setItem(
      getProjectDraftKey(userId),
      JSON.stringify(draft)
    );
  } catch {
    // 저장 용량 초과 또는 저장소 차단 시 입력 자체는 계속할 수 있게 한다.
  }
}

function hasProjectDraftValues(values: ProjectDraftValues) {
  return (
    values.title.trim().length > 0 ||
    values.description.trim().length > 0 ||
    values.tags.length > 0 ||
    values.url.trim().length > 0 ||
    values.image !== null
  );
}

export {
  hasProjectDraftValues,
  loadProjectDraft,
  PROJECT_DRAFT_TTL_MS,
  removeProjectDraft,
  saveProjectDraft,
};
export type { ProjectDraft, ProjectDraftValues };
