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
 * 이의제기는 백엔드에 상태/내용을 저장하는 테이블이 없어(ERD 기준) 조회 API가 없다.
 * 접수 직후 "검토 중"으로 보이게 하기 위한 세션 전용 상태이며, 새로고침하면 사라진다.
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
