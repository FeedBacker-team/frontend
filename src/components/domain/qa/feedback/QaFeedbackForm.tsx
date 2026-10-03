'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { QaParticipationAbandonDialog } from '@/components/domain/qa/detail/QaParticipationAbandonDialog';
import { QaFeedbackDraftExitDialog } from '@/components/domain/qa/feedback/QaFeedbackDraftExitDialog';
import { QaFeedbackQuestionCard } from '@/components/domain/qa/feedback/QaFeedbackQuestionCard';
import { QaFeedbackSummaryCard } from '@/components/domain/qa/feedback/QaFeedbackSummaryCard';
import { QaFeedbackTargetCard } from '@/components/domain/qa/feedback/QaFeedbackTargetCard';
import {
  createQaFeedbackDefaultValues,
  hasQaFeedbackAnswers,
  mergeQaFeedbackDraftValues,
  normalizeQaFeedbackQuestions,
} from '@/lib/qa/feedback';
import {
  loadQaFeedbackDraft,
  QA_FEEDBACK_DRAFT_TTL_MS,
  removeQaFeedbackDraft,
  saveQaFeedbackDraft,
} from '@/lib/qa/feedbackDraft';
import { createQaFeedbackFormSchema } from '@/lib/schemas/qaFeedback';
import {
  useQaFeedbackForm,
  useQaRecruitmentDetail,
  useSubmitQaFeedback,
} from '@/hooks/useQaRecruitments';
import { useProjectDetail } from '@/hooks/useProjects';
import type {
  QaFeedbackFormResponse,
  QaFeedbackFormValues,
  QaRecruitmentDetailResponse,
} from '@/types/qa';
import type { ProjectDetail } from '@/types/project';

// TODO: 실제 인증 연동 시 메모리 auth store의 currentUserId로 교체한다.
const MOCK_CURRENT_USER_ID = '00000000-0000-4000-8000-000000000001';
const DRAFT_AUTOSAVE_DELAY_MS = 400;

type QaFeedbackFormProps = {
  feedbackPostId: string;
};

type QaFeedbackFormContentProps = {
  feedbackPostId: string;
  qa: QaRecruitmentDetailResponse;
  project: ProjectDetail;
  formResponse: QaFeedbackFormResponse;
};

function QaFeedbackFormContent({
  feedbackPostId,
  qa,
  project,
  formResponse,
}: QaFeedbackFormContentProps) {
  const router = useRouter();
  const [isAbandonDialogOpen, setIsAbandonDialogOpen] = useState(false);
  const [isDraftExitDialogOpen, setIsDraftExitDialogOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const draftExpiresAtRef = useRef(0);
  const isDraftReadyRef = useRef(false);
  const isDraftExpiredRef = useRef(false);
  const questions = useMemo(
    () => normalizeQaFeedbackQuestions(formResponse),
    [formResponse]
  );
  const defaultValues = useMemo(
    () => createQaFeedbackDefaultValues(questions),
    [questions]
  );
  const schema = useMemo(
    () => createQaFeedbackFormSchema(questions),
    [questions]
  );
  const form = useForm<QaFeedbackFormValues>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues,
  });
  const answers = useWatch({ control: form.control, name: 'answers' });
  const { mutate: submitFeedback, isPending: isSubmitting } =
    useSubmitQaFeedback(feedbackPostId);

  const persistDraft = useCallback(() => {
    if (!isDraftReadyRef.current || isDraftExpiredRef.current) {
      return;
    }

    const values = form.getValues();

    if (!hasQaFeedbackAnswers(values)) {
      removeQaFeedbackDraft(feedbackPostId, MOCK_CURRENT_USER_ID);
      return;
    }

    saveQaFeedbackDraft({
      feedbackPostId,
      userId: MOCK_CURRENT_USER_ID,
      values,
      expiresAt: draftExpiresAtRef.current,
    });
  }, [feedbackPostId, form]);

  const moveTo = useCallback(
    (href: string) => {
      if (!hasQaFeedbackAnswers(form.getValues())) {
        router.push(href);
        return;
      }

      setPendingHref(href);
      setIsDraftExitDialogOpen(true);
    },
    [form, router]
  );

  useEffect(() => {
    const draft = loadQaFeedbackDraft(
      feedbackPostId,
      MOCK_CURRENT_USER_ID
    );

    if (draft) {
      draftExpiresAtRef.current = draft.expiresAt;
      form.reset(mergeQaFeedbackDraftValues(questions, draft.values));
    } else {
      // TODO: 참여 API에 제출 만료 시각이 추가되면 해당 값을 사용한다.
      draftExpiresAtRef.current = Date.now() + QA_FEEDBACK_DRAFT_TTL_MS;
    }

    isDraftReadyRef.current = true;
    const remainingTime = draftExpiresAtRef.current - Date.now();
    const expirationTimer = window.setTimeout(() => {
      isDraftExpiredRef.current = true;
      removeQaFeedbackDraft(feedbackPostId, MOCK_CURRENT_USER_ID);
    }, Math.max(0, remainingTime));

    return () => window.clearTimeout(expirationTimer);
  }, [feedbackPostId, form, questions]);

  useEffect(() => {
    if (!isDraftReadyRef.current) {
      return;
    }

    const autosaveTimer = window.setTimeout(
      persistDraft,
      DRAFT_AUTOSAVE_DELAY_MS
    );

    return () => window.clearTimeout(autosaveTimer);
  }, [answers, persistDraft]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasQaFeedbackAnswers(form.getValues())) {
        return;
      }

      persistDraft();
      event.preventDefault();
      event.returnValue = '';
    };

    const handlePageHide = () => {
      persistDraft();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('popstate', persistDraft);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('popstate', persistDraft);
    };
  }, [form, persistDraft]);

  useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href]');

      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')
      ) {
        return;
      }

      const destinationUrl = new URL(anchor.href, window.location.href);

      if (destinationUrl.origin !== window.location.origin) {
        return;
      }

      const destination = `${destinationUrl.pathname}${destinationUrl.search}${destinationUrl.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (
        destination === current ||
        !hasQaFeedbackAnswers(form.getValues())
      ) {
        return;
      }

      event.preventDefault();
      setPendingHref(destination);
      setIsDraftExitDialogOpen(true);
    };

    document.addEventListener('click', handleInternalLinkClick, true);

    return () => {
      document.removeEventListener('click', handleInternalLinkClick, true);
    };
  }, [form]);

  const moveToDetail = () => moveTo(`/qa/${feedbackPostId}`);
  const handleValidSubmit = (values: QaFeedbackFormValues) => {
    submitFeedback(
      { questions, values },
      {
        onSuccess: () => {
          isDraftExpiredRef.current = true;
          removeQaFeedbackDraft(feedbackPostId, MOCK_CURRENT_USER_ID);
          toast.success('피드백을 제출했습니다');
          router.replace(`/qa/${feedbackPostId}`);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : '피드백 제출에 실패했습니다'
          );
        },
      }
    );
  };
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(handleValidSubmit)(event);
  };
  const handleSaveAndExit = () => {
    const href = pendingHref;

    persistDraft();
    setIsDraftExitDialogOpen(false);
    setPendingHref(null);

    if (href) {
      router.push(href);
    }
  };
  const handleContinue = () => {
    setIsDraftExitDialogOpen(false);
    setPendingHref(null);
  };
  const handleAbandon = () => {
    isDraftExpiredRef.current = true;
    removeQaFeedbackDraft(feedbackPostId, MOCK_CURRENT_USER_ID);
    setIsAbandonDialogOpen(false);
    router.push(`/qa/${feedbackPostId}`);
  };

  return (
    <FormProvider {...form}>
      <>
        <div className="flex items-start gap-10">
          <main className="min-w-0 flex-1">
            <form
              noValidate
              className="flex flex-col gap-5"
              onSubmit={handleFormSubmit}
            >
              <QaFeedbackTargetCard qa={qa} project={project} />

              <div className="flex flex-col gap-5">
                {questions.map((question) => (
                  <QaFeedbackQuestionCard
                    key={`${question.type}-${question.order}`}
                    question={question}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  size="medium"
                  onClick={moveToDetail}
                >
                  나가기
                </Button>
                <Button
                  type="submit"
                  size="medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '제출 중...' : '피드백 제출하기'}
                </Button>
              </div>
            </form>
          </main>

          <aside className="w-80 shrink-0">
            <QaFeedbackSummaryCard
              questions={questions}
              rewardAcorn={qa.rewardAcorn}
              onAbandon={() => setIsAbandonDialogOpen(true)}
            />
          </aside>
        </div>

        <QaFeedbackDraftExitDialog
          open={isDraftExitDialogOpen}
          onOpenChange={setIsDraftExitDialogOpen}
          onContinue={handleContinue}
          onSaveAndExit={handleSaveAndExit}
        />

        <QaParticipationAbandonDialog
          open={isAbandonDialogOpen}
          onOpenChange={setIsAbandonDialogOpen}
          onConfirm={handleAbandon}
        />
      </>
    </FormProvider>
  );
}

function QaFeedbackForm({ feedbackPostId }: QaFeedbackFormProps) {
  const router = useRouter();
  const detailQuery = useQaRecruitmentDetail(feedbackPostId);
  const formQuery = useQaFeedbackForm(feedbackPostId);
  const projectQuery = useProjectDetail(detailQuery.data?.projectId);
  const isPending =
    detailQuery.isPending ||
    formQuery.isPending ||
    (!!detailQuery.data && projectQuery.isPending);
  const error = detailQuery.error ?? formQuery.error ?? projectQuery.error;

  if (isPending) {
    return (
      <div
        className="flex animate-pulse items-start gap-10"
        aria-label="QA 피드백 작성 화면 불러오는 중"
      >
        <div className="h-180 min-w-0 flex-1 rounded-2xl bg-gray-100" />
        <div className="h-70 w-80 shrink-0 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (error || !detailQuery.data || !formQuery.data || !projectQuery.data) {
    return (
      <section className="flex min-h-100 flex-col items-center justify-center gap-5 rounded-2xl bg-bg-default p-10 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 text-text-default">
            QA 작성 정보를 찾을 수 없습니다
          </h1>
          <p className="text-b2 text-text-sub">
            {error instanceof Error
              ? error.message
              : '모집글 주소를 다시 확인해 주세요.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={() => router.push(`/qa/${feedbackPostId}`)}
          >
            QA 상세로 돌아가기
          </Button>
          <Button
            type="button"
            size="medium"
            onClick={() => {
              void Promise.all([
                detailQuery.refetch(),
                formQuery.refetch(),
                projectQuery.refetch(),
              ]);
            }}
          >
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  return (
    <QaFeedbackFormContent
      feedbackPostId={feedbackPostId}
      qa={detailQuery.data}
      project={projectQuery.data}
      formResponse={formQuery.data}
    />
  );
}

export { QaFeedbackForm };
export type { QaFeedbackFormProps };
