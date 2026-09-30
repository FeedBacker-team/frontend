import { ApiError, baseApiRequest } from '@/apis/baseClient';

const TAGS_PATH = '/api/tags';

type TagItem = {
  code: string;
  displayName: string;
};

function isTagItem(value: unknown): value is TagItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'string' &&
    value.code.length > 0 &&
    'displayName' in value &&
    typeof value.displayName === 'string' &&
    value.displayName.length > 0
  );
}

async function getTags(signal?: AbortSignal): Promise<TagItem[]> {
  const data = await baseApiRequest<unknown>(TAGS_PATH, {
    method: 'GET',
    signal,
    fallbackMessage: '관심 분야를 불러오지 못했습니다',
  });

  if (!Array.isArray(data) || !data.every(isTagItem)) {
    throw new ApiError('관심 분야 응답 형식이 올바르지 않습니다', 500);
  }

  return data;
}

export { getTags };
export type { TagItem };
