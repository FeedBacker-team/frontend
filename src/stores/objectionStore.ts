'use client';

import { create } from 'zustand';

import type { ObjectionReasonValue } from '@/types/mypage';

type FiledObjection = {
  reason: ObjectionReasonValue;
  detailReason: string;
  submittedAt: string;
};

type ObjectionState = {
  filedByFeedbackId: Record<string, FiledObjection>;
  markObjectionFiled: (feedbackId: string, objection: FiledObjection) => void;
};

/**
 * 이의제기 제출 직후에는 백엔드 상태(OBJECTED)가 아직 반영되기 전일 수 있어,
 * 그 짧은 틈 동안 "검토 중"을 낙관적으로 보여주기 위한 세션 전용 상태다.
 * 새로고침하면 사라지지만, 이후 조회 시 실제 상태로 자연스럽게 대체된다.
 */
const useObjectionStore = create<ObjectionState>()((set) => ({
  filedByFeedbackId: {},

  markObjectionFiled: (feedbackId, objection) => {
    set((state) => ({
      filedByFeedbackId: {
        ...state.filedByFeedbackId,
        [feedbackId]: objection,
      },
    }));
  },
}));

export { useObjectionStore };
export type { FiledObjection };
