import { CheckBox } from '@/components/common/CheckBox';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import type { QaFeedbackQuestion } from '@/types/mypage';

type MyQaFeedbackQuestionViewProps = {
  question: QaFeedbackQuestion;
};

function MyQaFeedbackQuestionView({
  question,
}: MyQaFeedbackQuestionViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-h4 text-text-default">
        {question.order}번{' '}
        {question.required ? (
          <span className="text-rust-600">*</span>
        ) : (
          <span className="text-c1 text-text-sub">(선택)</span>
        )}
      </p>
      <p className="text-b2 text-text-default">{question.question}</p>

      {question.type === 'SINGLE_CHOICE' && (
        <RadioGroup
          defaultValue={question.selectedOption}
          className="pointer-events-none"
        >
          {question.options.map((option) => (
            <Radio key={option} value={option} label={option} />
          ))}
        </RadioGroup>
      )}

      {question.type === 'MULTIPLE_CHOICE' && (
        <div className="pointer-events-none flex flex-col gap-3">
          {question.options.map((option) => (
            <CheckBox
              key={option}
              defaultChecked={question.selectedOptions.includes(option)}
              label={option}
            />
          ))}
        </div>
      )}

      {question.type === 'TEXT' && (
        <div className="rounded-lg border border-gray-300 p-4 text-b2 text-text-default whitespace-pre-wrap">
          {question.answer}
        </div>
      )}
    </div>
  );
}

export { MyQaFeedbackQuestionView };
export type { MyQaFeedbackQuestionViewProps };
