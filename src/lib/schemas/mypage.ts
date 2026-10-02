import { z } from 'zod';

import {
  FEEDBACK_REJECT_DETAIL_MAX_LENGTH,
  FEEDBACK_REJECT_DETAIL_MIN_LENGTH,
  FEEDBACK_REJECT_REASONS,
  OBJECTION_DETAIL_MIN_LENGTH,
  OBJECTION_REASONS,
  WITHDRAW_REASONS,
} from '@/constants/mypage';

const [firstObjectionReason, ...restObjectionReasons] = OBJECTION_REASONS.map(
  (item) => item.value
);

const objectionSchema = z.object({
  reason: z.enum([firstObjectionReason, ...restObjectionReasons], {
    error: '이의제기 사유를 선택해 주세요',
  }),
  detailReason: z
    .string()
    .trim()
    .min(
      OBJECTION_DETAIL_MIN_LENGTH,
      `상세 사유는 최소 ${OBJECTION_DETAIL_MIN_LENGTH}자 이상 작성해 주세요`
    ),
});

const [firstWithdrawReason, ...restWithdrawReasons] = WITHDRAW_REASONS.map(
  (item) => item.value
);

const withdrawSchema = z
  .object({
    reason: z.enum([firstWithdrawReason, ...restWithdrawReasons], {
      error: '탈퇴 사유를 선택해 주세요',
    }),
    etcReason: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.reason === 'ETC' && values.etcReason.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['etcReason'],
        message: '기타 사유를 입력해 주세요',
      });
    }
  });

const [firstFeedbackRejectReason, ...restFeedbackRejectReasons] =
  FEEDBACK_REJECT_REASONS.map((item) => item.value);

const feedbackRejectSchema = z.object({
  reason: z.enum(
    [firstFeedbackRejectReason, ...restFeedbackRejectReasons],
    { error: '거절 사유를 선택해 주세요' }
  ),
  detailReason: z
    .string()
    .trim()
    .min(
      FEEDBACK_REJECT_DETAIL_MIN_LENGTH,
      `상세 사유는 최소 ${FEEDBACK_REJECT_DETAIL_MIN_LENGTH}자 이상 작성해 주세요`
    )
    .max(
      FEEDBACK_REJECT_DETAIL_MAX_LENGTH,
      `상세 사유는 최대 ${FEEDBACK_REJECT_DETAIL_MAX_LENGTH}자까지 작성할 수 있어요`
    ),
});

type ObjectionFormValues = z.infer<typeof objectionSchema>;
type WithdrawFormValues = z.infer<typeof withdrawSchema>;
type FeedbackRejectFormValues = z.infer<typeof feedbackRejectSchema>;

export { feedbackRejectSchema, objectionSchema, withdrawSchema };
export type {
  FeedbackRejectFormValues,
  ObjectionFormValues,
  WithdrawFormValues,
};
