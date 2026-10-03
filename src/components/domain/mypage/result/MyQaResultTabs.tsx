'use client';

import { useState } from 'react';

import { MyQaResultQuestionStatsView } from '@/components/domain/mypage/result/MyQaResultQuestionStatsView';
import { MyQaResultTesterAnswerPager } from '@/components/domain/mypage/result/MyQaResultTesterAnswerPager';
import { cn } from '@/lib/utils';
import type { MyQaResultDetail } from '@/types/mypage';

type MyQaResultTab = 'QUESTION' | 'TESTER';

const MY_QA_RESULT_TAB_ORDER: MyQaResultTab[] = ['QUESTION', 'TESTER'];

const MY_QA_RESULT_TAB_LABEL: Record<MyQaResultTab, string> = {
  QUESTION: '문항별 보기',
  TESTER: '테스터별 보기',
};

type MyQaResultTabsProps = {
  questionStats: MyQaResultDetail['questionStats'];
  testerAnswers: MyQaResultDetail['testerAnswers'];
};

function MyQaResultTabs({ questionStats, testerAnswers }: MyQaResultTabsProps) {
  const [tab, setTab] = useState<MyQaResultTab>('QUESTION');

  return (
    <section className="flex flex-col gap-8 rounded-2xl border border-gray-300 bg-white p-7">
      <div
        role="tablist"
        aria-label="QA 결과 보기 방식"
        className="grid grid-cols-2 border-b border-gray-300"
      >
        {MY_QA_RESULT_TAB_ORDER.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              'cursor-pointer pb-4 text-center text-h4 transition-colors',
              tab === item
                ? 'border-b-2 border-rust-600 text-rust-600'
                : 'text-text-disabled'
            )}
          >
            {MY_QA_RESULT_TAB_LABEL[item]}
          </button>
        ))}
      </div>

      {tab === 'QUESTION' ? (
        <div className="flex flex-col gap-10">
          {questionStats.map((question) => (
            <MyQaResultQuestionStatsView key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <MyQaResultTesterAnswerPager testerAnswers={testerAnswers} />
      )}
    </section>
  );
}

export { MyQaResultTabs };
export type { MyQaResultTabsProps };
