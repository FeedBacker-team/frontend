import { useQuery } from '@tanstack/react-query';

import { getTags } from '@/apis/tags';

const tagKeys = {
  all: ['tags'] as const,
};

function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: ({ signal }) => getTags(signal),
    staleTime: 5 * 60 * 1000,
  });
}

export { tagKeys, useTags };
