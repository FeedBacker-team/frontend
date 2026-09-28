'use client';

import { useEffect, useState } from 'react';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import Image from 'next/image';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import {
  createQaRecruitQuestion,
  QaRecruitQuestionEditor,
  type QaRecruitQuestionType,
} from '@/components/domain/qa/recruit/QaRecruitQuestionEditor';
import {
  ImageViewer,
  type ImageViewerItem,
} from '@/components/domain/shared/ImageViewer';
import {
  MOCK_OWNED_ACORNS,
  QA_CHOICE_QUESTION_COST,
  QA_SUBJECTIVE_QUESTION_COST,
} from '@/constants/qa';
import type { QaRecruitFormValues, QaTargetType } from '@/types/qa';

type TestImagePreviewItemProps = {
  image?: ImageViewerItem;
  index: number;
  onOpen: () => void;
};

function getFileId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
}

function useFilePreviewImages(files: File[]) {
  const signature = files.map(getFileId).join('|');
  const [previewState, setPreviewState] = useState<{
    signature: string;
    images: ImageViewerItem[];
  }>({ signature: '', images: [] });

  useEffect(() => {
    let canceled = false;
    const readers: FileReader[] = [];

    const previewPromise = Promise.all(
      files.map(
        (file, index) =>
          new Promise<ImageViewerItem>((resolve, reject) => {
            const reader = new FileReader();
            readers.push(reader);

            reader.addEventListener('load', () => {
              if (typeof reader.result === 'string') {
                resolve({
                  id: getFileId(file),
                  src: reader.result,
                  alt: `테스트 이미지 ${index + 1}: ${file.name}`,
                });
                return;
              }

              reject(new Error('이미지 미리보기를 생성할 수 없습니다.'));
            });
            reader.addEventListener('error', () => {
              reject(
                reader.error ??
                  new Error('이미지 미리보기를 생성할 수 없습니다.')
              );
            });
            reader.readAsDataURL(file);
          })
      )
    );

    void previewPromise
      .then((images) => {
        if (!canceled) {
          setPreviewState({ signature, images });
        }
      })
      .catch(() => {
        if (!canceled) {
          setPreviewState({ signature, images: [] });
        }
      });

    return () => {
      canceled = true;

      readers.forEach((reader) => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      });
    };
  }, [files, signature]);

  return previewState.signature === signature ? previewState.images : [];
}

function TestImagePreviewItem({
  image,
  index,
  onOpen,
}: TestImagePreviewItemProps) {
  return (
    <li className="flex min-w-0 flex-col items-center gap-3">
      <span className="flex size-6.5 items-center justify-center rounded-full bg-bg-light text-c1 text-text-sub">
        {index + 1}
      </span>
      <button
        type="button"
        disabled={!image}
        aria-label={image ? `${image.alt} 크게 보기` : undefined}
        onClick={onOpen}
        className="relative size-50 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#d9d9d9] disabled:cursor-default"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized
            sizes="200px"
            className="object-cover"
          />
        ) : null}
      </button>
    </li>
  );
}

function TestImagePreview() {
  const { control } = useFormContext<QaRecruitFormValues>();
  const testImages = useWatch({ control, name: 'testImages' }) ?? [];
  const previewImages = useFilePreviewImages(testImages);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <section className="rounded-2xl bg-bg-default px-9 py-7">
        <h2 className="text-h3 text-text-default">테스트 이미지 미리보기</h2>
        <ol className="mt-6 grid grid-cols-3 gap-6">
          {testImages.map((file, index) => (
            <TestImagePreviewItem
              key={getFileId(file)}
              image={previewImages[index]}
              index={index}
              onOpen={() => setViewerIndex(index)}
            />
          ))}
        </ol>
      </section>

      <ImageViewer
        open={viewerIndex !== null}
        images={previewImages}
        currentIndex={viewerIndex ?? 0}
        onIndexChange={setViewerIndex}
        onOpenChange={(open) => {
          if (!open) {
            setViewerIndex(null);
          }
        }}
      />
    </>
  );
}

type AcornUsageSummaryProps = {
  onBack: () => void;
};

function AcornUsageSummary({ onBack }: AcornUsageSummaryProps) {
  const { control } = useFormContext<QaRecruitFormValues>();
  const questions = useWatch({ control, name: 'questions' }) ?? [];
  const slotCapacity = useWatch({ control, name: 'slotCapacity' }) ?? 0;
  const choiceQuestionCount = questions.filter(
    (question) => question.type !== 'SUBJECTIVE'
  ).length;
  const subjectiveQuestionCount = questions.filter(
    (question) => question.type === 'SUBJECTIVE'
  ).length;
  const questionCost =
    choiceQuestionCount * QA_CHOICE_QUESTION_COST +
    subjectiveQuestionCount * QA_SUBJECTIVE_QUESTION_COST;
  const totalCost = questionCost * slotCapacity;
  const hasInsufficientAcorns = totalCost > MOCK_OWNED_ACORNS;

  return (
    <aside className="sticky top-10 flex flex-col gap-4">
      <section className="rounded-2xl bg-bg-default p-5">
        <h2 className="text-h3 text-text-default">도토리 사용량</h2>

        <dl className="mt-5 flex flex-col gap-3 text-b3 text-text-sub">
          <div className="flex items-center justify-between text-c1 text-text-info">
            <dt>객관식 {choiceQuestionCount}문항 · 5 도토리</dt>
            <dd className="text-h4 text-text-sub">
              {choiceQuestionCount * QA_CHOICE_QUESTION_COST}
            </dd>
          </div>
          <div className="flex items-center justify-between text-c1 text-text-info">
            <dt>주관식 {subjectiveQuestionCount}문항 · 10 도토리</dt>
            <dd className="text-h4 text-text-sub">
              {subjectiveQuestionCount * QA_SUBJECTIVE_QUESTION_COST}
            </dd>
          </div>
          <div className="flex items-center justify-between text-c1 text-text-info">
            <dt>모집 인원</dt>
            <dd className="text-h4 text-text-sub">× {slotCapacity}</dd>
          </div>
        </dl>

        <div className="my-5 h-px bg-divider-default" />

        {hasInsufficientAcorns ? (
          <p className="mb-3 flex items-center gap-1 text-c2 text-system-alert">
            <span
              aria-hidden
              className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
            도토리 보유량이 부족해요
          </p>
        ) : null}

        <div className="flex items-center justify-between">
          <span className="text-h4 text-yellow-700">총 사용 도토리</span>
          <span className="flex items-center gap-2 text-h3 text-yellow-800">
            <Image
              src="/images/acorn.svg"
              alt=""
              aria-hidden
              width={16}
              height={23}
              unoptimized
            />
            {totalCost}
          </span>
        </div>

        <div className="flex items-center justify-end">
          <span className="mt-2 w-fit rounded-lg bg-bg-deep px-2 py-1 text-c2 text-text-sub">
            내 도토리 보유량: {MOCK_OWNED_ACORNS}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[auto_1fr] gap-2">
          <Button type="button" variant="outline" size="medium" onClick={onBack}>
            이전
          </Button>
          <Button
            type="submit"
            size="medium"
            disabled={hasInsufficientAcorns}
          >
            모집 글 등록하기
          </Button>
        </div>
      </section>

      {hasInsufficientAcorns ? (
        <div
          role="status"
          className="relative mx-6 rounded-lg bg-bg-default px-4 py-3 shadow-sm"
        >
          <span
            aria-hidden
            className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-bg-default"
          />
          <p className="relative text-c2 text-text-default">
            도토리가 부족하다면,
            <br />
            모집 인원이나 질문 수를 줄이거나
            <br />
            다른 QA에 참여해 도토리를 모아 보세요!
          </p>
        </div>
      ) : null}
    </aside>
  );
}

function QuestionEditorPlaceholder() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl bg-bg-default p-8 text-center">
      <Image
        src="/icons/test.svg"
        alt=""
        aria-hidden
        width={32}
        height={32}
        unoptimized
      />
      <div className="flex flex-col gap-1">
        <h2 className="text-h3 text-text-default">질문을 작성해 주세요</h2>
        <p className="text-b3 text-text-sub">
          객관식과 주관식을 포함해 최대 10개까지 설정할 수 있어요.
        </p>
      </div>
    </div>
  );
}

type QaRecruitQuestionStepProps = {
  target: QaTargetType;
  onBack: () => void;
};

function QaRecruitQuestionStep({ target, onBack }: QaRecruitQuestionStepProps) {
  const { clearErrors, control, formState, getFieldState, getValues } =
    useFormContext<QaRecruitFormValues>();
  const { fields, append, move, remove, update } = useFieldArray({
    control,
    name: 'questions',
  });
  const isFull = fields.length >= 10;
  const questionsError = getFieldState('questions', formState).error?.message;

  const handleAddQuestion = () => {
    append(createQaRecruitQuestion('SINGLE_CHOICE'));
  };

  const handleRemoveQuestion = (index: number) => {
    remove(index);
    toast.undo('항목이 삭제되었습니다.', { position: 'bottom-right' });
  };

  const handleTypeChange = (
    index: number,
    nextType: QaRecruitQuestionType
  ) => {
    const currentQuestion = getValues(`questions.${index}`);
    clearErrors(`questions.${index}`);
    update(index, createQaRecruitQuestion(nextType, currentQuestion));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }

    const { source } = event.operation;

    if (!isSortable(source)) {
      return;
    }

    const { index, initialIndex } = source;

    if (index !== initialIndex) {
      move(initialIndex, index);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_18rem] items-start gap-8">
      <main className="flex min-w-0 flex-col gap-4">
        {target === 'IMAGE' ? <TestImagePreview /> : null}
        {fields.length === 0 ? <QuestionEditorPlaceholder /> : null}
        <DragDropProvider onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <QaRecruitQuestionEditor
              key={field.id}
              sortableId={field.id}
              index={index}
              onRemove={() => handleRemoveQuestion(index)}
              onTypeChange={(nextType) => handleTypeChange(index, nextType)}
            />
          ))}
        </DragDropProvider>
        {questionsError ? (
          <p
            role="alert"
            className="flex items-center gap-1 text-c2 text-system-alert"
          >
            <span
              aria-hidden
              className="size-4 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
            {questionsError}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="medium"
          disabled={isFull}
          onClick={handleAddQuestion}
        >
          <span
            aria-hidden
            className="size-5 bg-current mask-[url(/icons/plus.svg)] mask-center mask-contain mask-no-repeat"
          />
          질문 추가하기
        </Button>
        <p className="text-c1 text-text-info">
          질문은 객관식, 주관식 포함 최대 10개까지 설정 가능
        </p>
      </main>

      <AcornUsageSummary onBack={onBack} />
    </div>
  );
}

export { QaRecruitQuestionStep };
export type { QaRecruitQuestionStepProps };
