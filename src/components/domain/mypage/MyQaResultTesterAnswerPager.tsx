'use client';

import { useState } from 'react';

import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { MyQaFeedbackQuestionView } from '@/components/domain/mypage/MyQaFeedbackQuestionView';
import {
  MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT,
  MY_QA_PARTICIPATION_STATUS_LABEL,
} from '@/constants/mypage';
import type { MyQaResultTesterAnswer } from '@/types/mypage';

type MyQaResultTesterAnswerPagerProps = {
  testerAnswers: MyQaResultTesterAnswer[];
};

function MyQaResultTesterAnswerPager({
  testerAnswers,
}: MyQaResultTesterAnswerPagerProps) {
  const [page, setPage] = useState(1);
  const current = testerAnswers[page - 1];

  return (
    <div className="flex flex-col gap-6">
      <Pagination
        page={page}
        totalPages={testerAnswers.length}
        onPageChange={setPage}
        className="justify-center pt-0"
      />

      <div className="flex items-center gap-3 rounded-2xl border border-gray-300 p-5">
        <div className="size-10 shrink-0 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-b1 text-text-default">
              {current.reviewerNickname}
            </p>
            <Badge variant={MY_QA_PARTICIPATION_STATUS_BADGE_VARIANT.ACCEPTED}>
              {MY_QA_PARTICIPATION_STATUS_LABEL.ACCEPTED}
            </Badge>
          </div>
          <p className="text-c1 text-text-sub">{current.submittedAt} 제출</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {current.feedbackQuestions.map((question) => (
          <MyQaFeedbackQuestionView key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

export { MyQaResultTesterAnswerPager };
export type { MyQaResultTesterAnswerPagerProps };
