import { userRequest } from './request';

const ACORN_HISTORY_PATH = '/api/acorn-histories';

type AcornHistoryType =
  | 'FEEDBACK_ACCEPT'
  | 'FEEDBACK_RECRUIT'
  | 'SIGNUP_REWARD'
  | 'EVENT_REWARD';

type AcornHistoryResponse = {
  type: AcornHistoryType;
  translateAt: string;
  beforeAcorn: number;
  afterAcorn: number;
  changeAcorn: number;
};

async function getAcornHistories(
  signal?: AbortSignal
): Promise<AcornHistoryResponse[]> {
  return userRequest<AcornHistoryResponse[]>(ACORN_HISTORY_PATH, {
    method: 'GET',
    signal,
    fallbackMessage: '도토리 사용 내역을 불러오지 못했습니다',
  });
}

export { getAcornHistories };
export type { AcornHistoryResponse, AcornHistoryType };
