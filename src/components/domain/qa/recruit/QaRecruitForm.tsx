'use client';

import { useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

import { toast } from '@/components/common/Sonner';
import { QaRecruitBasicStep } from '@/components/domain/qa/recruit/QaRecruitBasicStep';
import { QaRecruitQuestionStep } from '@/components/domain/qa/recruit/QaRecruitQuestionStep';
import { QaRecruitSubmitConfirmDialog } from '@/components/domain/qa/recruit/QaRecruitSubmitConfirmDialog';
import { useCreateQaRecruitment } from '@/hooks/useQaRecruitments';
import { qaRecruitFormSchema } from '@/lib/schemas/qa';
import { cn } from '@/lib/utils';
import type {
  QaRecruitableProject,
  QaRecruitFormStep,
  QaRecruitFormValues,
  QaTargetType,
} from '@/types/qa';

const TARGET_LABEL: Record<QaTargetType, string> = {
  SERVICE_LINK: '링크형 테스트',
  IMAGE: '이미지형 테스트',
};

const FORM_STEPS: Array<{
  value: QaRecruitFormStep;
  label: string;
}> = [
  { value: 'BASIC', label: '기본 정보 작성' },
  { value: 'QUESTIONS', label: '질문 작성' },
  { value: 'SUBMITTING', label: '모집 글 등록' },
];

type RecruitProgressProps = {
  currentStep: QaRecruitFormStep;
};

function RecruitProgress({ currentStep }: RecruitProgressProps) {
  return (
    <nav aria-label="QA 모집글 작성 단계" className="w-88 shrink-0 pt-1">
      <div
        aria-hidden
        className="relative top-2.5 mx-12 h-1 rounded-full bg-gray-300"
      />
      <ol className="relative flex items-start justify-between">
        {FORM_STEPS.map((step) => {
          const isCurrent = step.value === currentStep;

          return (
            <li
              key={step.value}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex min-w-24 flex-col items-center gap-3"
            >
              <span
                aria-hidden
                className="relative flex size-5 items-center justify-center"
              >
                <span
                  className={cn(
                    'absolute size-5 rounded-full',
                    isCurrent ? 'bg-rust-100' : 'bg-gray-200'
                  )}
                />
                <span
                  className={cn(
                    'relative size-3 rounded-full',
                    isCurrent ? 'bg-rust-600' : 'bg-gray-400'
                  )}
                />
              </span>
              <span
                className={`text-c1 whitespace-nowrap ${
                  isCurrent ? 'text-rust-600' : 'text-text-sub'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type QaRecruitFormProps = {
  project: QaRecruitableProject;
  target: QaTargetType;
};

function QaRecruitForm({ project, target }: QaRecruitFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<QaRecruitFormStep>('BASIC');
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const { mutate: createQaRecruitment, isPending: isSubmitting } =
    useCreateQaRecruitment();
  const form = useForm<QaRecruitFormValues>({
    resolver: zodResolver(qaRecruitFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      projectId: String(project.projectId),
      target,
      title: '',
      description: '',
      slotCapacity: undefined,
      endAt: '',
      serviceUrl: '',
      testImages: [],
      questions: [],
    },
    shouldUnregister: false,
  });

  const handleBasicNext = async () => {
    const fields: Array<keyof QaRecruitFormValues> = [
      'title',
      'description',
      'slotCapacity',
      'endAt',
      target === 'SERVICE_LINK' ? 'serviceUrl' : 'testImages',
    ];
    const isValid = await form.trigger(fields, { shouldFocus: true });

    if (isValid) {
      setStep('QUESTIONS');
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === 'BASIC') {
      event.preventDefault();
      void handleBasicNext();
      return;
    }

    void form.handleSubmit(() => setIsSubmitConfirmOpen(true))(event);
  };

  const handleConfirmedSubmit = () => {
    createQaRecruitment(form.getValues(), {
      onSuccess: ({ feedbackPostId }) => {
        setIsSubmitConfirmOpen(false);
        // TODO: 실제 생성 API 연동 시 응답의 사용/잔여 도토리 정보를
        // 상세 페이지의 1회성 완료 Toast에 전달한다.
        router.push(`/qa/${encodeURIComponent(feedbackPostId)}?created=1`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'QA 모집 글 등록에 실패했습니다'
        );
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className={cn(
          'flex w-full flex-col gap-8',
          step === 'BASIC' && 'mx-auto max-w-220'
        )}
      >
        <header
          className={cn(
            step === 'QUESTIONS' &&
              'grid grid-cols-[minmax(0,1fr)_18rem] gap-8'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-t3 text-text-default">
                QA 모집 글 작성하기
              </h1>
              <span className="rounded-full bg-green-100 px-3 py-2 text-c2 text-green-700">
                {TARGET_LABEL[target]}
              </span>
            </div>
            <RecruitProgress currentStep={step} />
          </div>
        </header>

        {step === 'BASIC' ? (
          <QaRecruitBasicStep project={project} target={target} />
        ) : null}

        {step === 'QUESTIONS' ? (
          <QaRecruitQuestionStep
            target={target}
            onBack={() => setStep('BASIC')}
          />
        ) : null}
      </form>

      <QaRecruitSubmitConfirmDialog
        open={isSubmitConfirmOpen}
        isPending={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setIsSubmitConfirmOpen(false);
          }
        }}
        onConfirm={handleConfirmedSubmit}
      />
    </FormProvider>
  );
}

export { QaRecruitForm };
export type { QaRecruitFormProps };
