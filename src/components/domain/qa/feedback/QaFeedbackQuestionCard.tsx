'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { CheckBox } from '@/components/common/CheckBox';
import { Input } from '@/components/common/Input';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { cn } from '@/lib/utils';
import type { QaFeedbackFormValues, QaFeedbackQuestion } from '@/types/qa';

type QaFeedbackQuestionCardProps = {
  question: QaFeedbackQuestion;
};

function QaFeedbackQuestionCard({ question }: QaFeedbackQuestionCardProps) {
  const isSubjective = question.type === 'SUBJECTIVE';
  const selectionFieldName =
    `answers.${question.order}.selectedOptions` as const;
  const textFieldName = `answers.${question.order}.text` as const;
  const {
    control,
    formState,
    getFieldState,
  } = useFormContext<QaFeedbackFormValues>();
  const text = useWatch({ control, name: textFieldName }) ?? '';
  const error = isSubjective
    ? getFieldState(textFieldName, formState).error?.message
    : getFieldState(selectionFieldName, formState).error?.message;
  const errorId = `qa-feedback-question-${question.order}-error`;

  return (
    <section
      className={cn(
        'flex flex-col gap-5 rounded-2xl border bg-bg-default p-9',
        error ? 'border-system-alert' : 'border-transparent'
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-h4 text-text-sub">
          {question.order}번{' '}
          {question.isRequire ? (
            <span className="text-system-alert" aria-label="필수 문항">
              *
            </span>
          ) : (
            <span className="text-c1 text-text-info">(선택)</span>
          )}
        </p>
        <h2 className="text-h4 text-text-default">{question.questionText}</h2>
      </div>

      {question.type === 'SINGLE_CHOICE' ? (
        <Controller
          control={control}
          name={selectionFieldName}
          render={({ field }) => (
            <RadioGroup
              ref={field.ref}
              name={field.name}
              value={field.value[0] ? String(field.value[0]) : ''}
              onValueChange={(value) => field.onChange([Number(value)])}
              onBlur={field.onBlur}
              size="medium"
              className="gap-3"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            >
              {question.optionText.map((option, index) => (
                <Radio
                  key={`${question.order}-${index}`}
                  value={String(index + 1)}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}
        />
      ) : null}

      {question.type === 'MULTIPLE_CHOICE' ? (
        <Controller
          control={control}
          name={selectionFieldName}
          render={({ field }) => (
            <div
              className="flex flex-col gap-3"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            >
              {question.optionText.map((option, index) => {
                const optionValue = index + 1;

                return (
                  <CheckBox
                    ref={index === 0 ? field.ref : undefined}
                    key={`${question.order}-${index}`}
                    name={field.name}
                    value={String(optionValue)}
                    checked={field.value.includes(optionValue)}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked
                          ? [...field.value, optionValue]
                          : field.value.filter(
                              (selectedOption) =>
                                selectedOption !== optionValue
                            )
                      );
                    }}
                    onBlur={field.onBlur}
                    size="medium"
                    label={option}
                  />
                );
              })}
            </div>
          )}
        />
      ) : null}

      {isSubjective ? (
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name={textFieldName}
            render={({ field }) => (
              <Input
                {...field}
                aria-label={`${question.order}번 주관식 답변`}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                placeholder="내용을 입력하세요"
                state={error ? 'error' : 'default'}
                className="bg-white"
              />
            )}
          />
          <div className="flex items-center justify-between">
            <p className="text-c1 text-text-info">
              {question.minimumLength
                ? `최소 ${question.minimumLength}자 이상 작성해 주세요.`
                : '자유롭게 의견을 작성해 주세요.'}
            </p>
            <span className="shrink-0 tabular-nums text-h4 text-text-sub">
              {question.minimumLength
                ? `${text.length} / ${question.minimumLength}자`
                : `${text.length}자`}
            </span>
          </div>
        </div>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-c2 text-system-alert"
        >
          <span
            aria-hidden
            className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
          />
          {error}
        </p>
      ) : null}
    </section>
  );
}

export { QaFeedbackQuestionCard };
export type { QaFeedbackQuestionCardProps };
