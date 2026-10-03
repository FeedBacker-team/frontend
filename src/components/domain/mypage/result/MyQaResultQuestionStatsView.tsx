import { MyQaResultBarList } from '@/components/domain/mypage/result/MyQaResultBarList';
import { MyQaResultPieChart } from '@/components/domain/mypage/result/MyQaResultPieChart';
import { MyQaResultTextAnswerPager } from '@/components/domain/mypage/result/MyQaResultTextAnswerPager';
import type { QaResultQuestion } from '@/types/mypage';

type MyQaResultQuestionStatsViewProps = {
  question: QaResultQuestion;
};

function MyQaResultQuestionStatsView({
  question,
}: MyQaResultQuestionStatsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-h4 text-text-default">
          {question.order}번{' '}
          {question.required ? (
            <span className="text-rust-600">*</span>
          ) : (
            <span className="text-c1 text-text-sub">(선택)</span>
          )}
        </p>
        <p className="text-b2 text-text-default">{question.question}</p>
        <p className="text-c1 text-text-sub">응답 {question.responseCount}개</p>
      </div>

      {question.type === 'SINGLE_CHOICE' && (
        <MyQaResultPieChart optionStats={question.optionStats} />
      )}
      {question.type === 'MULTIPLE_CHOICE' && (
        <MyQaResultBarList optionStats={question.optionStats} />
      )}
      {question.type === 'TEXT' && (
        <MyQaResultTextAnswerPager answers={question.answers} />
      )}
    </div>
  );
}

export { MyQaResultQuestionStatsView };
export type { MyQaResultQuestionStatsViewProps };
