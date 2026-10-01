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

export { extractImagePathFromUrl };
