'use client';

import { useSortable } from '@dnd-kit/react/sortable';
import Image from 'next/image';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Toggle } from '@/components/common/Toggle';
import { cn } from '@/lib/utils';
import type {
  QaRecruitFormValues,
  QaRecruitQuestionFormValue,
} from '@/types/qa';

type QaRecruitQuestionType = QaRecruitQuestionFormValue['type'];

const QUESTION_TYPE_OPTIONS: Array<{
  value: QaRecruitQuestionType;
  label: string;
}> = [
  { value: 'SINGLE_CHOICE', label: '객관식 - 단일선택' },
  { value: 'MULTIPLE_CHOICE', label: '객관식 - 복수선택' },
  { value: 'SUBJECTIVE', label: '주관식' },
];

const DEFAULT_OPTIONS = ['', ''];
const MAX_OPTION_COUNT = 5;

type QuestionFieldErrorProps = {
  id: string;
  message?: string;
};

function QuestionFieldError({ id, message }: QuestionFieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1 text-c2 text-system-alert"
    >
      <span
        aria-hidden
        className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
      />
      {message}
    </p>
  );
}

function createQaRecruitQuestion(
  type: QaRecruitQuestionType,
  previous?: QaRecruitQuestionFormValue
): QaRecruitQuestionFormValue {
  const commonValues = {
    clientId: previous?.clientId ?? crypto.randomUUID(),
    questionText: previous?.questionText ?? '',
    isRequire: previous?.isRequire ?? false,
    allowImageAttachment:
      previous?.type === 'SUBJECTIVE' ? previous.allowImageAttachment : false,
  };

  if (type === 'SUBJECTIVE') {
    return {
      ...commonValues,
      type,
      minimumLength:
        previous?.type === 'SUBJECTIVE' ? previous.minimumLength : 50,
    };
  }

  const options =
    previous?.type === 'SINGLE_CHOICE' || previous?.type === 'MULTIPLE_CHOICE'
      ? previous.options
      : [...DEFAULT_OPTIONS];

  return {
    ...commonValues,
    type,
    options,
    maxSelectionCount:
      type === 'SINGLE_CHOICE' ? 1 : Math.max(1, options.length),
    allowImageAttachment: false,
  };
}

type QuestionTypeDropdownProps = {
  value: QaRecruitQuestionType;
  onChange: (value: QaRecruitQuestionType) => void;
};

function QuestionTypeDropdown({ value, onChange }: QuestionTypeDropdownProps) {
  const selectedLabel = QUESTION_TYPE_OPTIONS.find(
    (option) => option.value === value
  )?.label;

  return (
    <Dropdown
      value={value}
      onValueChange={(nextValue) =>
        onChange(nextValue as QaRecruitQuestionType)
      }
    >
      <DropdownTrigger className="h-11 w-52">
        <DropdownValue>{selectedLabel}</DropdownValue>
      </DropdownTrigger>
      <DropdownContent>
        {QUESTION_TYPE_OPTIONS.map((option) => (
          <DropdownItem key={option.value} value={option.value}>
            {option.label}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

type ChoiceQuestionFieldsProps = {
  index: number;
  question: Extract<
    QaRecruitQuestionFormValue,
    { type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' }
  >;
};

function ChoiceQuestionFields({ index, question }: ChoiceQuestionFieldsProps) {
  const { formState, getFieldState, setValue } =
    useFormContext<QaRecruitFormValues>();
  const isSingleChoice = question.type === 'SINGLE_CHOICE';
  const isFull = question.options.length >= MAX_OPTION_COUNT;
  const optionsError = getFieldState(
    `questions.${index}.options`,
    formState
  ).error?.message;

  const updateOptions = (options: string[]) => {
    setValue(`questions.${index}.options`, options, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setValue(
      `questions.${index}.maxSelectionCount`,
      isSingleChoice ? 1 : Math.max(1, options.length),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    updateOptions(
      question.options.map((option, currentIndex) =>
        currentIndex === optionIndex ? value : option
      )
    );
  };

  const handleOptionRemove = (optionIndex: number) => {
    updateOptions(
      question.options.filter((_, currentIndex) => currentIndex !== optionIndex)
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex flex-col gap-3">
        {question.options.map((option, optionIndex) => {
          const errorId = `qa-question-${index}-option-${optionIndex}-error`;
          const optionError = getFieldState(
            `questions.${index}.options.${optionIndex}`,
            formState
          ).error?.message;

          return (
            <li key={optionIndex} className="flex min-w-0 flex-col gap-1 px-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className={
                    isSingleChoice
                      ? 'size-6 shrink-0 rounded-full border border-icon-sub'
                      : 'size-6 shrink-0 rounded-[4px] border border-icon-sub'
                  }
                />
                <input
                  type="text"
                  value={option}
                  onChange={(event) =>
                    handleOptionChange(optionIndex, event.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent text-b2 text-text-default outline-none placeholder:text-text-disabled"
                  placeholder="선택지 문구를 입력해 주세요"
                  aria-label={`${index + 1}번 질문의 ${optionIndex + 1}번 선택지`}
                  aria-invalid={!!optionError}
                  aria-describedby={optionError ? errorId : undefined}
                />
                <button
                  type="button"
                  aria-label={`${optionIndex + 1}번 선택지 삭제`}
                  onClick={() => handleOptionRemove(optionIndex)}
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-bg-light"
                >
                  <Image
                    src="/icons/x.svg"
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              <QuestionFieldError id={errorId} message={optionError} />
            </li>
          );
        })}
      </ol>

      <QuestionFieldError
        id={`qa-question-${index}-options-error`}
        message={optionsError}
      />

      <div className="flex items-center justify-end gap-4">
        <span className="text-c1 text-text-info">최대 5개</span>
        <Button
          type="button"
          variant="outline"
          size="small"
          disabled={isFull}
          onClick={() => updateOptions([...question.options, ''])}
          leftIcon={
            <span
              aria-hidden
              className="size-4 bg-current mask-[url(/icons/plus.svg)] mask-center mask-contain mask-no-repeat"
            />
          }
        >
          선택지 추가
        </Button>
      </div>
    </div>
  );
}

type SubjectiveQuestionFieldsProps = {
  index: number;
};

function SubjectiveQuestionFields({ index }: SubjectiveQuestionFieldsProps) {
  const { formState, getFieldState, register } =
    useFormContext<QaRecruitFormValues>();
  const errorId = `qa-question-${index}-minimum-length-error`;
  const minimumLengthError = getFieldState(
    `questions.${index}.minimumLength`,
    formState
  ).error?.message;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center justify-end gap-3">
        <label
          htmlFor={`qa-question-${index}-minimum-length`}
          className="text-h4 text-text-default"
        >
          최소 답변 글자 수
        </label>
        <div className="w-20">
          <Input
            id={`qa-question-${index}-minimum-length`}
            type="number"
            inputMode="numeric"
            min={1}
            size="medium"
            state={minimumLengthError ? 'error' : 'default'}
            aria-invalid={!!minimumLengthError}
            aria-describedby={minimumLengthError ? errorId : undefined}
            {...register(`questions.${index}.minimumLength`, {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
          />
        </div>
        <span className="text-h4 text-text-default">자</span>
      </div>
      <QuestionFieldError id={errorId} message={minimumLengthError} />
    </div>
  );
}

type QaRecruitQuestionEditorProps = {
  sortableId: string;
  index: number;
  onRemove: () => void;
  onTypeChange: (type: QaRecruitQuestionType) => void;
};

function QaRecruitQuestionEditor({
  sortableId,
  index,
  onRemove,
  onTypeChange,
}: QaRecruitQuestionEditorProps) {
  const { control, formState, getFieldState, register } =
    useFormContext<QaRecruitFormValues>();
  const { handleRef, isDragging, ref } = useSortable({
    id: sortableId,
    index,
  });
  const question = useWatch({
    control,
    name: `questions.${index}`,
  });

  if (!question) {
    return null;
  }

  const isSubjective = question.type === 'SUBJECTIVE';
  const questionTextErrorId = `qa-question-${index}-text-error`;
  const questionTextError = getFieldState(
    `questions.${index}.questionText`,
    formState
  ).error?.message;

  return (
    <article
      ref={ref}
      className={cn(
        'flex flex-col gap-6 rounded-2xl bg-bg-default p-7 transition-[opacity,box-shadow]',
        isDragging && 'relative z-10 opacity-70 shadow-lg'
      )}
    >
      <header className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-3">
        <button
          ref={handleRef}
          type="button"
          aria-label={`${index + 1}번 질문 순서 변경`}
          className="flex size-6 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <Image
            src="/icons/grip-horizontal.svg"
            alt=""
            aria-hidden
            width={24}
            height={24}
            unoptimized
          />
        </button>
        <span className="text-h3 whitespace-nowrap text-text-default">
          {index + 1}번
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <Input
            aria-label={`${index + 1}번 질문 문구`}
            size="medium"
            state={questionTextError ? 'error' : 'default'}
            aria-invalid={!!questionTextError}
            aria-describedby={
              questionTextError ? questionTextErrorId : undefined
            }
            placeholder="질문을 입력해 주세요"
            {...register(`questions.${index}.questionText`)}
          />
          <QuestionFieldError
            id={questionTextErrorId}
            message={questionTextError}
          />
        </div>
        <QuestionTypeDropdown value={question.type} onChange={onTypeChange} />
        <Button
          type="button"
          variant="outline"
          size="medium"
          aria-label={`${index + 1}번 질문 삭제`}
          className="h-12 w-16 [&_img]:size-6"
          onClick={onRemove}
        >
          <Image
            src="/icons/trash.svg"
            alt=""
            aria-hidden
            width={24}
            height={24}
            unoptimized
          />
        </Button>
      </header>

      {isSubjective ? (
        <SubjectiveQuestionFields index={index} />
      ) : (
        <ChoiceQuestionFields index={index} question={question} />
      )}

      <div className="h-px bg-divider-default" />

      <footer className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Controller
            control={control}
            name={`questions.${index}.isRequire`}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onCheckedChange={field.onChange}
                label="필수 입력"
              />
            )}
          />
          {isSubjective ? (
            <Controller
              control={control}
              name={`questions.${index}.allowImageAttachment`}
              render={({ field }) => (
                <Toggle
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label="답변 시 이미지 첨부"
                />
              )}
            />
          ) : null}
        </div>

        <Badge
          variant="yellow"
          icon={
            <Image
              src="/images/acorn.svg"
              alt=""
              aria-hidden
              width={14}
              height={20}
              className="h-5! w-3.5!"
              unoptimized
            />
          }
        >
          {isSubjective ? 10 : 5}
        </Badge>
      </footer>
    </article>
  );
}

export { QaRecruitQuestionEditor, createQaRecruitQuestion };
export type { QaRecruitQuestionEditorProps, QaRecruitQuestionType };
