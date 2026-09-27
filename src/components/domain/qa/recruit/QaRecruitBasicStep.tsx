'use client';

import { useState, type ChangeEvent, type ReactNode } from 'react';
import { Popover } from '@base-ui/react/popover';
import { addDays, format, parseISO, startOfDay } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Calendar } from '@/components/common/Calendar';
import { FileUpload, FileUploadItem } from '@/components/common/FileUpload';
import { Input, inputVariants } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { ALLOWED_IMAGE_TYPES } from '@/constants/file';
import { cn } from '@/lib/utils';
import { validateImageFiles } from '@/lib/validateImageFile';
import type {
  QaRecruitableProject,
  QaRecruitFormValues,
  QaTargetType,
} from '@/types/qa';

type FormFieldProps = {
  label: string;
  description: string;
  htmlFor: string;
  children: ReactNode;
};

function FormField({ label, description, htmlFor, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={htmlFor} className="text-h4 text-text-default">
          {label}
          <span aria-hidden className="ml-1 text-system-alert">
            *
          </span>
        </label>
        <p className="text-b3 text-text-sub">{description}</p>
      </div>
      {children}
    </div>
  );
}

type FieldErrorMessageProps = {
  id: string;
  message?: string;
};

function FieldErrorMessage({ id, message }: FieldErrorMessageProps) {
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

type ProjectSummaryProps = {
  project: QaRecruitableProject;
};

function ProjectSummary({ project }: ProjectSummaryProps) {
  return (
    <article className="flex items-center gap-3 rounded-[12px] bg-bg-light px-5 py-4">
      <div className="relative size-13 shrink-0 overflow-hidden rounded-[4px] bg-[#d9d9d9]">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt=""
            fill
            unoptimized
            sizes="52px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-h4 truncate text-text-default">{project.title}</h2>
        <p className="text-b3 truncate text-text-sub">{project.description}</p>
      </div>
    </article>
  );
}

type QaRecruitBasicStepProps = {
  project: QaRecruitableProject;
  target: QaTargetType;
};

const MAX_TEST_IMAGE_COUNT = 3;

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

function QaRecruitImageField() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QaRecruitFormValues>();
  const testImages = useWatch({ control, name: 'testImages' }) ?? [];
  const isFull = testImages.length >= MAX_TEST_IMAGE_COUNT;
  const formErrorMessage = errors.testImages?.message;
  const visibleErrorMessage = errorMessage ?? formErrorMessage;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';

    if (selectedFiles.length === 0) {
      return;
    }

    const existingKeys = new Set(
      testImages.map(
        (file) => `${file.name}-${file.size}-${file.lastModified}-${file.type}`
      )
    );
    const nextImages = [...testImages];

    selectedFiles.forEach((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;

      if (!existingKeys.has(key)) {
        existingKeys.add(key);
        nextImages.push(file);
      }
    });

    const validation = validateImageFiles(nextImages, MAX_TEST_IMAGE_COUNT);

    if (!validation.ok) {
      setErrorMessage(validation.message);
      return;
    }

    setErrorMessage(null);
    setValue('testImages', nextImages, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleRemove = (index: number) => {
    setErrorMessage(null);
    setValue(
      'testImages',
      testImages.filter((_, imageIndex) => imageIndex !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );
  };

  return (
    <FormField
      label="테스트 이미지(최대 3개)"
      description="테스터가 검토할 UI 스크린샷, 비교 시안, 와이어프레임 등 피드백이 필요한 이미지를 첨부해 주세요."
      htmlFor="qa-recruit-test-images"
    >
      <FileUpload
        id="qa-recruit-test-images"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple
        disabled={isFull}
        aria-invalid={!!visibleErrorMessage}
        aria-describedby={
          visibleErrorMessage ? 'qa-recruit-test-images-error' : undefined
        }
        state={visibleErrorMessage ? 'error' : 'default'}
        containerClassName="min-h-30"
        title="파일을 이곳으로 드래그하거나 클릭하여 업로드하세요"
        description="PNG, JPG 형식 지원 · 파일당 최대 5MB (최대 3개)"
        onChange={handleImageChange}
      />

      <FieldErrorMessage
        id="qa-recruit-test-images-error"
        message={visibleErrorMessage}
      />

      {testImages.length > 0 ? (
        <ol className="flex flex-col gap-2">
          {testImages.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${file.type}`}
              className="flex gap-3"
            >
              <span className="flex size-6.5 shrink-0 items-center justify-center self-center rounded-full bg-bg-light text-c1 text-text-sub">
                {index + 1}
              </span>
              <FileUploadItem
                className="min-w-0 flex-1 text-b2 text-text-default"
                label={`${file.name} [${formatFileType(file.type)}, ${formatFileSize(file.size)}]`}
                onRemove={() => handleRemove(index)}
              />
            </li>
          ))}
        </ol>
      ) : null}
    </FormField>
  );
}

function QaRecruitBasicStep({ project, target }: QaRecruitBasicStepProps) {
  const router = useRouter();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QaRecruitFormValues>();
  const today = startOfDay(new Date());
  const maxEndAt = addDays(today, 28);

  return (
    <section className="flex flex-col gap-12 rounded-2xl bg-bg-default p-9">
      <ProjectSummary project={project} />

      <FormField
        label="제목"
        description="어떤 피드백을 받고 싶은지, 어떤 영역을 점검해야 하는지 테스터가 한눈에 알 수 있게 적어주세요."
        htmlFor="qa-recruit-title"
      >
        <Input
          id="qa-recruit-title"
          required
          size="medium"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'qa-recruit-title-error' : undefined}
          state={errors.title ? 'error' : 'default'}
          placeholder="예) 신규 결제 기능 모듈 및 예외 처리 플로우 QA"
          {...register('title')}
        />
        <FieldErrorMessage
          id="qa-recruit-title-error"
          message={errors.title?.message}
        />
      </FormField>

      <FormField
        label="설명"
        description="테스터가 하단 문항들에 답변하기 전 알아야 할 진행 방식, 테스트 환경 등을 안내해 주세요."
        htmlFor="qa-recruit-description"
      >
        <Textarea
          id="qa-recruit-description"
          required
          size="medium"
          className="min-h-50"
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? 'qa-recruit-description-error' : undefined
          }
          state={errors.description ? 'error' : 'default'}
          placeholder={
            '예)\n[테스트 범위 & 가이드]\n이번 QA는 [신규 결제 기능] 중심입니다. 아래 작성된 질문 순서대로 직접 서비스를 사용해 보신 뒤 답변을 작성해 주세요.\n\n[권장 테스트 환경]\n  · Chrome 브라우저 / 모바일 Web 환경 권장\n  · 오류 발견 시 마지막 주관식 문항에 캡처나 재현 경로를 함께 남겨주시면 큰 도움이 됩니다!'
          }
          {...register('description')}
        />
        <FieldErrorMessage
          id="qa-recruit-description-error"
          message={errors.description?.message}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-12">
        <FormField
          label="모집 인원"
          description="최대 50명까지 모집 가능해요."
          htmlFor="qa-recruit-capacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-20">
              <Input
                id="qa-recruit-capacity"
                type="number"
                inputMode="numeric"
                required
                min={1}
                max={50}
                size="medium"
                aria-invalid={!!errors.slotCapacity}
                aria-describedby={
                  errors.slotCapacity
                    ? 'qa-recruit-capacity-error'
                    : undefined
                }
                state={errors.slotCapacity ? 'error' : 'default'}
                placeholder="00"
                {...register('slotCapacity', {
                  setValueAs: (value) =>
                    value === '' ? undefined : Number(value),
                })}
              />
            </div>
            <span className="text-c1 text-text-default">명</span>
          </div>
          <FieldErrorMessage
            id="qa-recruit-capacity-error"
            message={errors.slotCapacity?.message}
          />
        </FormField>

        <FormField
          label="모집 종료일"
          description="오늘 날짜로부터 최대 28일까지 설정 가능해요."
          htmlFor="qa-recruit-end-at"
        >
          <Controller
            name="endAt"
            control={control}
            render={({ field }) => {
              const selectedDate = field.value
                ? parseISO(field.value)
                : undefined;

              return (
                <Popover.Root
                  open={isCalendarOpen}
                  onOpenChange={(open) => {
                    setIsCalendarOpen(open);

                    if (!open) {
                      field.onBlur();
                    }
                  }}
                >
                  <Popover.Trigger
                    ref={field.ref}
                    id="qa-recruit-end-at"
                    aria-required="true"
                    aria-invalid={!!errors.endAt}
                    aria-describedby={
                      errors.endAt ? 'qa-recruit-end-at-error' : undefined
                    }
                    className={cn(
                      inputVariants({
                        size: 'medium',
                        state: errors.endAt ? 'error' : 'default',
                      }),
                      'cursor-pointer items-center justify-between text-left'
                    )}
                  >
                    <span
                      className={
                        selectedDate ? 'text-text-default' : 'text-gray-500'
                      }
                    >
                      {selectedDate
                        ? format(selectedDate, 'yyyy.MM.dd')
                        : '날짜를 선택해 주세요'}
                    </span>
                    <span
                      aria-hidden
                      className="size-5 shrink-0 bg-text-sub mask-[url(/icons/calendar.svg)] mask-center mask-contain mask-no-repeat"
                    />
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner
                      side="bottom"
                      align="end"
                      sideOffset={8}
                      className="z-50"
                    >
                      <Popover.Popup className="origin-[var(--transform-origin)] outline-none transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          defaultMonth={selectedDate ?? today}
                          startMonth={today}
                          endMonth={maxEndAt}
                          disabled={{ before: today, after: maxEndAt }}
                          onSelect={(date) => {
                            if (!date) {
                              return;
                            }

                            field.onChange(format(date, 'yyyy-MM-dd'));
                            setIsCalendarOpen(false);
                          }}
                        />
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              );
            }}
          />
          <FieldErrorMessage
            id="qa-recruit-end-at-error"
            message={errors.endAt?.message}
          />
        </FormField>
      </div>

      {target === 'SERVICE_LINK' ? (
        <FormField
          label="테스트 URL"
          description="테스터가 접속할 링크를 입력해 주세요."
          htmlFor="qa-recruit-service-url"
        >
          <Input
            id="qa-recruit-service-url"
            type="url"
            required
            size="medium"
            aria-invalid={!!errors.serviceUrl}
            aria-describedby={
              errors.serviceUrl ? 'qa-recruit-service-url-error' : undefined
            }
            state={errors.serviceUrl ? 'error' : 'default'}
            placeholder="https://"
            {...register('serviceUrl')}
          />
          <FieldErrorMessage
            id="qa-recruit-service-url-error"
            message={errors.serviceUrl?.message}
          />
        </FormField>
      ) : (
        <QaRecruitImageField />
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="medium"
          onClick={() => router.push('/qa')}
        >
          취소
        </Button>
        <Button type="submit" size="medium">
          질문 작성하기
        </Button>
      </div>
    </section>
  );
}

export { QaRecruitBasicStep };
export type { QaRecruitBasicStepProps };
