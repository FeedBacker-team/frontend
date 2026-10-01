import { useQuery } from '@tanstack/react-query';

import { getAcornHistories } from '@/apis/users';
import type { AcornHistoryResponse } from '@/apis/users';
import { ACORN_HISTORY_TYPE_LABEL } from '@/constants/mypage';
import type { AcornTransactionItem } from '@/types/mypage';

const acornHistoryKeys = {
  all: ['acornHistories'] as const,
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function mapToAcornTransactionItem(
  response: AcornHistoryResponse,
  index: number
): AcornTransactionItem {
  return {
    id: String(index),
    title: ACORN_HISTORY_TYPE_LABEL[response.type],
    date: formatDate(response.translateAt),
    amount: response.changeAcorn,
  };
}

type UseAcornHistoriesOptions = {
  enabled?: boolean;
};

function useAcornHistories({ enabled = true }: UseAcornHistoriesOptions = {}) {
  return useQuery({
    queryKey: acornHistoryKeys.all,
    queryFn: ({ signal }) => getAcornHistories(signal),
    select: (data) => data.map(mapToAcornTransactionItem),
    enabled,
  });
}

export { useAcornHistories };
