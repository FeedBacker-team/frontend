function extractImagePathFromUrl(url: string): string {
  const marker = '/object/public/';
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return url;
  }

  const pathWithBucket = url.slice(markerIndex + marker.length);
  const [, ...rest] = pathWithBucket.split('/');

  return rest.join('/');
}

/**
 * 서버가 완성된 URL 대신 스토리지 상대 경로(`images/xxx.png`)만 내려주는 응답을 위한 보정.
 * 같은 응답에 들어있는 다른 필드의 완전한 URL(referenceUrl)에서 버킷까지의 base를 추출해 재사용한다.
 */
function resolveImageUrl(path: string, referenceUrl: string): string {
  const marker = '/object/public/';
  const markerIndex = referenceUrl.indexOf(marker);

  if (markerIndex === -1) {
    return path;
  }

  const bucketStart = markerIndex + marker.length;
  const bucketEnd = referenceUrl.indexOf('/', bucketStart);
  const base =
    bucketEnd === -1 ? referenceUrl : referenceUrl.slice(0, bucketEnd + 1);

  return `${base}${path}`;
}

/**
 * images 버킷 public base. 프로젝트 썸네일(thumbnail_image) 등 이미 완성된 URL로 내려오는
 * 응답에서 공통으로 확인된 값이라 fallback으로 쓴다. 참고할 수 있는 완전한 URL이 응답에 없을 때만 사용한다.
 */
const FALLBACK_PUBLIC_IMAGE_BASE_URL =
  'https://jmamdqldmankdwzyzwtq.supabase.co/storage/v1/object/public/public-images/';

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

/**
 * 값이 완성된 URL인지 스토리지 상대 경로인지 아직 확정되지 않은 응답 필드를 위한 정규화.
 * 이미 완전한 URL이면 그대로 쓰고, 상대 경로면 referenceUrl(같은 응답의 다른 완전한 URL) 또는
 * FALLBACK_PUBLIC_IMAGE_BASE_URL을 기준으로 완전한 URL을 만든다.
 * 실제 API 응답 형식이 확정되면 이 분기 처리는 정리해도 된다.
 */
function normalizeImageUrl(
  value: string | null | undefined,
  referenceUrl?: string | null
): string | null {
  if (!value) {
    return null;
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  const base =
    referenceUrl && isAbsoluteUrl(referenceUrl)
      ? referenceUrl
      : FALLBACK_PUBLIC_IMAGE_BASE_URL;

  return resolveImageUrl(value, base);
}

export {
  extractImagePathFromUrl,
  isAbsoluteUrl,
  normalizeImageUrl,
  resolveImageUrl,
};
