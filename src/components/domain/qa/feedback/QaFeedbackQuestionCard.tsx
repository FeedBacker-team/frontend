'use client';

import { useState, type ChangeEvent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { CheckBox } from '@/components/common/CheckBox';
import { FileUpload, FileUploadItem } from '@/components/common/FileUpload';
import { Input } from '@/components/common/Input';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { ALLOWED_IMAGE_TYPES } from '@/constants/file';
import { cn } from '@/lib/utils';
import { validateImageFile } from '@/lib/validateImageFile';
import type { QaFeedbackFormValues, QaFeedbackQuestion } from '@/types/qa';

type QaFeedbackQuestionCardProps = {
  question: QaFeedbackQuestion;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
}

function formatFileType(type: string) {
  return type === 'image/jpeg'
    ? 'JPG'
    : type.replace('image/', '').toUpperCase();
}

function QaFeedbackQuestionCard({ question }: QaFeedbackQuestionCardProps) {
  const [imageSelectionError, setImageSelectionError] = useState<string | null>(
    null
  );
  const isSubjective = question.type === 'SUBJECTIVE';
  const selectionFieldName =
    `answers.${question.order}.selectedOptions` as const;
  const textFieldName = `answers.${question.order}.text` as const;
  const imageFieldName = `answers.${question.order}.image` as const;
  const {
    control,
    formState,
    getFieldState,
    setValue,
  } = useFormContext<QaFeedbackFormValues>();
  const text = useWatch({ control, name: textFieldName }) ?? '';
  const image = useWatch({ control, name: imageFieldName });
  const answerError = isSubjective
    ? getFieldState(textFieldName, formState).error?.message
    : getFieldState(selectionFieldName, formState).error?.message;
  const imageError = isSubjective
    ? (imageSelectionError ??
      getFieldState(imageFieldName, formState).error?.message)
    : undefined;
  const hasError = !!answerError || !!imageError;
  const errorId = `qa-feedback-question-${question.order}-error`;
  const imageDescriptionId = `qa-feedback-question-${question.order}-image-description`;
  const imageErrorId = `qa-feedback-question-${question.order}-image-error`;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = '';

    if (!file) {
      return;
    }

    const validation = validateImageFile(file);

    if (!validation.ok) {
      setImageSelectionError(validation.message);
      return;
    }

    setImageSelectionError(null);
    setValue(imageFieldName, file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleImageRemove = () => {
    setImageSelectionError(null);
    setValue(imageFieldName, null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section
      className={cn(
        'flex flex-col gap-5 rounded-2xl border bg-bg-default p-9',
        hasError ? 'border-system-alert' : 'border-transparent'
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
              aria-invalid={!!answerError}
              aria-describedby={answerError ? errorId : undefined}
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
              aria-invalid={!!answerError}
              aria-describedby={answerError ? errorId : undefined}
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name={textFieldName}
              render={({ field }) => (
                <Input
                  {...field}
                  aria-label={`${question.order}번 주관식 답변`}
                  aria-invalid={!!answerError}
                  aria-describedby={answerError ? errorId : undefined}
                  placeholder="내용을 입력하세요"
                  state={answerError ? 'error' : 'default'}
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

          {question.allowImageAttachment ? (
            <div className="flex flex-col gap-2">
              <p
                id={imageDescriptionId}
                className="flex items-center gap-1 text-c2 text-text-sub"
              >
                <span
                  aria-hidden
                  className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
                />
                답변을 더 정확하게 설명할 수 있는 화면 캡처나 이미지를
                첨부해 주세요.
              </p>
              <FileUpload
                id={`qa-feedback-question-${question.order}-image`}
                name={imageFieldName}
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                aria-invalid={!!imageError}
                aria-describedby={
                  imageError
                    ? `${imageDescriptionId} ${imageErrorId}`
                    : imageDescriptionId
                }
                state={imageError ? 'error' : 'default'}
                title="파일을 이곳으로 드래그하거나 클릭하여 업로드하세요"
                description="PNG, JPG 형식 지원 · 파일당 최대 5MB (최대 1개)"
                onChange={handleImageChange}
              />
              {image ? (
                <FileUploadItem
                  label={`${image.name} [${formatFileType(image.type)}, ${formatFileSize(image.size)}]`}
                  onRemove={handleImageRemove}
                />
              ) : null}
              {imageError ? (
                <p
                  id={imageErrorId}
                  role="alert"
                  className="flex items-center gap-1 text-c2 text-system-alert"
                >
                  <span
                    aria-hidden
                    className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
                  />
                  {imageError}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {answerError ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-c2 text-system-alert"
        >
          <span
            aria-hidden
            className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
          />
          {answerError}
        </p>
      ) : null}
    </section>
  );
}

export { QaFeedbackQuestionCard };
export type { QaFeedbackQuestionCardProps };
