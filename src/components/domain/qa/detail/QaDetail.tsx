'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { toast } from '@/components/common/Sonner';
import { ToastLarge } from '@/components/common/ToastLarge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/common/Tooltip';
import { useActionGuard } from '@/components/domain/auth/ActionGuardProvider';
import { QaEarlyCloseConfirmDialog } from '@/components/domain/qa/detail/QaEarlyCloseConfirmDialog';
import { QaParticipationAbandonDialog } from '@/components/domain/qa/detail/QaParticipationAbandonDialog';
import { QaParticipationActiveCard } from '@/components/domain/qa/detail/QaParticipationActiveCard';
import { QaParticipationConfirmDialog } from '@/components/domain/qa/detail/QaParticipationConfirmDialog';
import {
  ImageViewer,
  type ImageViewerItem,
} from '@/components/domain/shared/ImageViewer';
import { PROJECT_TAG_LABEL } from '@/constants/project';
import { useProjectDetail } from '@/hooks/useProjects';
import {
  useCompleteQaRecruitment,
  useGiveUpQaParticipation,
  useParticipateInQa,
  useQaRecruitmentDetail,
} from '@/hooks/useQaRecruitments';
import {
  formatQaDeadlineLabel,
  getQaDaysRemaining,
} from '@/lib/qa/deadline';
import { markdownToPlainText } from '@/lib/markdown/plainText';
import type {
  QaRecruitmentDetailResponse,
  QuestionConfigResponse,
} from '@/types/qa';
import type { ProjectDetail } from '@/types/project';

const TARGET_TYPE_LABEL = {
  SERVICE_LINK: '링크형',
  IMAGE: '이미지형',
} as const;
const QA_PARTICIPATION_DURATION_MS = 24 * 60 * 60 * 1000;

type QaDetailProps = {
  feedbackPostId: string;
  showCreatedToast?: boolean;
};

function formatDate(value: string) {
  return value.slice(0, 10);
}

function QaDetailLoading() {
  return (
    <div className="flex animate-pulse gap-10" aria-label="QA 상세 불러오는 중">
      <div className="h-180 min-w-0 flex-1 rounded-2xl bg-gray-100" />
      <div className="h-80 w-80 shrink-0 rounded-2xl bg-gray-100" />
    </div>
  );
}

type QaDetailErrorProps = {
  message: string;
  onRetry: () => void;
};

function QaDetailError({ message, onRetry }: QaDetailErrorProps) {
  return (
    <section className="flex min-h-100 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-text-default">
          QA 상세 정보를 불러오지 못했습니다
        </h1>
        <p className="text-b2 text-text-sub">{message}</p>
      </div>
      <Button size="medium" onClick={onRetry}>
        다시 시도
      </Button>
    </section>
  );
}

type QaProjectBannerProps = {
  project: ProjectDetail;
};

function QaProjectBanner({ project }: QaProjectBannerProps) {
  const plainDescription = markdownToPlainText(project.description);

  return (
    <section className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-rust-600 bg-rust-50 px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
        <p className="text-c1 text-rust-600">프로젝트</p>
        <h2 className="text-h3 w-full truncate text-text-default">
          {project.title}
        </h2>
        <p
          title={plainDescription}
          className="text-b2 w-full truncate text-text-sub"
        >
          {plainDescription}
        </p>
      </div>
      <Button
        nativeButton={false}
        render={<Link href={`/projects/${project.projectId}`} />}
        size="medium"
        className="shrink-0"
        rightIcon={
          <span
            aria-hidden
            className="size-5 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
          />
        }
      >
        자세히 보기
      </Button>
    </section>
  );
}

type QaTargetPreviewProps = {
  qa: QaRecruitmentDetailResponse;
};

function QaTargetPreview({ qa }: QaTargetPreviewProps) {
  const isLinkType = qa.targetType === 'SERVICE_LINK';
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (isLinkType) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-text-info">테스트 URL</h2>
        <div className="flex max-w-125 items-center gap-2">
          <Input
            readOnly
            aria-label="QA 테스트 URL"
            value={qa.serviceUrl ?? ''}
            className="h-10 border-border-default bg-white"
          />
          <Button
            nativeButton={false}
            render={
              <a
                href={qa.serviceUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="medium"
            disabled={!qa.serviceUrl}
            rightIcon={
              <span
                aria-hidden
                className="size-5 bg-current mask-[url(/icons/arrow-up-right.svg)] mask-center mask-contain mask-no-repeat"
              />
            }
          >
            열기
          </Button>
        </div>
      </section>
    );
  }

  const testImages = qa.images
    .filter((image) => image.type === 'POST')
    .sort((a, b) => a.order - b.order);
  const viewerImages: ImageViewerItem[] = testImages.map((image, index) => ({
    id: `${image.type}-${image.order}`,
    src: image.url,
    alt: `테스트 이미지 ${index + 1}`,
  }));

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-h4 text-text-info">테스트 이미지 미리보기</h2>
      {testImages.length > 0 ? (
        <ol className="flex flex-wrap gap-5">
          {testImages.map((image, index) => (
            <li
              key={`${image.type}-${image.order}`}
              className="flex w-50 flex-col items-center gap-3"
            >
              <span className="flex size-6.5 items-center justify-center rounded-full bg-bg-light text-c1 text-text-sub">
                {index + 1}
              </span>
              <button
                type="button"
                aria-label={`${index + 1}번째 테스트 이미지 크게 보기`}
                onClick={() => setViewerIndex(index)}
                className="group relative size-50 cursor-pointer overflow-hidden rounded-xl bg-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={image.url}
                  alt={`테스트 이미지 ${index + 1}`}
                  fill
                  unoptimized
                  sizes="200px"
                  className="cursor-pointer object-cover transition-transform group-hover:scale-[1.02]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-gray-900/0 text-c1 text-gray-50 opacity-0 transition-all group-hover:bg-gray-900/50 group-hover:opacity-100">
                  자세히 보기
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-b3 text-text-sub">
          등록된 테스트 이미지가 없습니다.
        </p>
      )}

      <ImageViewer
        open={viewerIndex !== null}
        images={viewerImages}
        currentIndex={viewerIndex ?? 0}
        onIndexChange={setViewerIndex}
        onOpenChange={(open) => {
          if (!open) {
            setViewerIndex(null);
          }
        }}
      />
    </section>
  );
}

type QaQuestionSummaryProps = {
  questionConfig: QuestionConfigResponse;
};

function QaQuestionSummary({ questionConfig }: QaQuestionSummaryProps) {
  const items = [
    {
      label: '총 문항 수',
      value: `${questionConfig.totalQuestionCount}문항`,
    },
    {
      label: '객관식',
      value: `${questionConfig.choiceQuestionCount}문항`,
    },
    {
      label: '주관식',
      value: `${questionConfig.subjectiveQuestionCount}문항`,
    },
    {
      label: '예상 소요 시간',
      value: `약 ${questionConfig.estimatedTime}분`,
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4 text-text-info">질문 구성</h2>
      <dl className="grid max-w-150 grid-cols-4 overflow-hidden rounded-xl bg-bg-light">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center gap-1 px-6 py-5 text-center"
          >
            <dt className="text-c1 text-text-info">{item.label}</dt>
            <dd className="text-h3 text-text-default">{item.value}</dd>
            {index < items.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-5 right-0 bottom-5 w-px bg-gray-300"
              />
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

type QaDetailCardProps = {
  qa: QaRecruitmentDetailResponse;
  project: ProjectDetail;
};

function QaDetailCard({ qa, project }: QaDetailCardProps) {
  const daysRemaining = getQaDaysRemaining(qa.endAt);
  const ownerProfileImageSrc =
    project.ownerProfileImageUrl || '/icons/basic-avatars.svg';
  const postThumbnailUrl =
    qa.images.find((image) => image.type === 'POST_THUMBNAIL')?.url ?? null;

  return (
    <article className="flex w-full flex-col gap-8 rounded-2xl bg-bg-default p-9">
      <header className="flex gap-6">
        <div className="relative size-50 shrink-0 overflow-hidden rounded-xl bg-[#d9d9d9]">
          {postThumbnailUrl ? (
            <Image
              src={postThumbnailUrl}
              alt=""
              fill
              unoptimized
              sizes="200px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6 justify-center">
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-2">
              {qa.tags.map((tag) => (
                <li key={tag}>
                  <Chip label={PROJECT_TAG_LABEL[tag]} state="unchecked" hash />
                </li>
              ))}
            </ul>
            <h1 className="text-t3 text-text-default">{qa.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src={ownerProfileImageSrc}
                  alt=""
                  aria-hidden
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 shrink-0 rounded-full border border-border-default bg-gray-200 object-cover"
                />
                <span className="text-c1 text-text-default">
                  {project.ownerNickname}
                </span>
              </div>
              <p className="text-c1 text-text-info">
                {formatDate(qa.startAt)} ~ {formatDate(qa.endAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge>{TARGET_TYPE_LABEL[qa.targetType]}</Badge>
            <Badge variant={daysRemaining <= 2 ? 'rust' : 'green'}>
              {formatQaDeadlineLabel(daysRemaining)}
            </Badge>
            <Badge
              variant="yellow"
              icon={
                <Image
                  src="/images/acorn.svg"
                  alt=""
                  aria-hidden
                  width={12}
                  height={16}
                  unoptimized
                />
              }
            >
              {qa.rewardAcorn}
            </Badge>
          </div>
        </div>
      </header>

      <QaProjectBanner project={project} />

      <hr className="divider-default" />

      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-text-info">QA 설명</h2>
        <MarkdownContent className="text-b2">
          {qa.description}
        </MarkdownContent>
      </section>

      <QaTargetPreview qa={qa} />
      <QaQuestionSummary questionConfig={qa.questionConfig} />
    </article>
  );
}

type QaRecruitmentStatusCardProps = {
  qa: QaRecruitmentDetailResponse;
  isOwner: boolean;
};

function QaRecruitmentStatusCard({
  qa,
  isOwner,
}: QaRecruitmentStatusCardProps) {
  const router = useRouter();
  const { runProtectedAction } = useActionGuard();
  const [isEarlyCloseDialogOpen, setIsEarlyCloseDialogOpen] = useState(false);
  const [isParticipationDialogOpen, setIsParticipationDialogOpen] =
    useState(false);
  const [isAbandonDialogOpen, setIsAbandonDialogOpen] = useState(false);
  const [localParticipationDeadlineAt, setLocalParticipationDeadlineAt] =
    useState<number | null>(null);
  const participationMutation = useParticipateInQa(qa.feedbackPostId);
  const giveUpMutation = useGiveUpQaParticipation(qa.feedbackPostId);
  const completeMutation = useCompleteQaRecruitment(qa.feedbackPostId);
  const serverParticipationDeadlineAt = qa.expireAt
    ? new Date(qa.expireAt).getTime()
    : null;
  const participationDeadlineAt =
    serverParticipationDeadlineAt !== null &&
    Number.isFinite(serverParticipationDeadlineAt)
      ? serverParticipationDeadlineAt
      : localParticipationDeadlineAt;
  const hasParticipated =
    qa.myFeedbackStatus !== null || localParticipationDeadlineAt !== null;
  const isWriting =
    qa.myFeedbackStatus === 'WRITING' ||
    (qa.myFeedbackStatus === null && localParticipationDeadlineAt !== null);
  const hasActiveParticipation =
    isWriting &&
    participationDeadlineAt !== null &&
    Number.isFinite(participationDeadlineAt);
  const participantCount = Math.max(
    0,
    qa.slotCapacity - qa.remainSlotCount
  );
  const requiredParticipantCount = Math.max(0, qa.remainSlotCount);
  const completionRate =
    qa.slotCapacity > 0
      ? Math.min(
          100,
          Math.max(0, (participantCount / qa.slotCapacity) * 100)
        )
      : 0;
  const isRecruiting = qa.status === 'RECRUITING';
  const canParticipate =
    !hasParticipated && isRecruiting && qa.remainSlotCount > 0;
  const participationButtonLabel = (() => {
    switch (qa.myFeedbackStatus) {
      case 'SUBMITTED':
      case 'ACCEPTED':
      case 'REJECTED':
      case 'OBJECTED':
      case 'OBJECTION_ACCEPTED':
      case 'OBJECTION_REJECTED':
        return '참여 완료';
      case 'WRITING':
        return '참여 중';
      case 'CANCELED':
        return '참여 취소';
      case 'EXPIRED':
        return '제출 기한 만료';
      default:
        if (!isRecruiting) {
          return '모집이 종료되었습니다';
        }

        if (qa.remainSlotCount <= 0) {
          return '모집 인원 마감';
        }

        return 'QA 참여하기';
    }
  })();
  const participationButton = (
    <Button
      size="medium"
      className="w-full"
      disabled={!canParticipate}
      onClick={() =>
        runProtectedAction(() => setIsParticipationDialogOpen(true))
      }
    >
      {participationButtonLabel}
    </Button>
  );

  if (!isOwner && hasActiveParticipation) {
    return (
      <>
        <QaParticipationActiveCard
          deadlineAt={participationDeadlineAt}
          rewardAcorn={qa.rewardAcorn}
          onFeedback={() =>
            router.push(`/qa/${qa.feedbackPostId}/feedback`)
          }
          onAbandon={() => setIsAbandonDialogOpen(true)}
        />

        <QaParticipationAbandonDialog
          open={isAbandonDialogOpen}
          onOpenChange={(open) => {
            if (!giveUpMutation.isPending) {
              setIsAbandonDialogOpen(open);
            }
          }}
          isPending={giveUpMutation.isPending}
          onConfirm={() => {
            giveUpMutation.mutate(undefined, {
              onSuccess: () => {
                setIsAbandonDialogOpen(false);
                toast.success('QA 참여를 포기했습니다');
              },
              onError: (error) => {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'QA 참여 포기에 실패했습니다'
                );
              },
            });
          }}
        />
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-5 rounded-2xl bg-bg-default p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-h3 text-text-default">진행 상황</h2>
          <dl className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <dt className="text-text-info text-c1">전체 모집 인원</dt>
              <dd className="text-text-default text-h4">
                {qa.slotCapacity}명
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-info text-c1">참여 인원</dt>
              <dd className="text-text-default text-h4">
                {participantCount}명
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-info text-c1">필요 인원</dt>
              <dd className="text-text-default text-h4">
                {requiredParticipantCount}명
              </dd>
            </div>
          </dl>
        </div>

        <div
          role="progressbar"
          aria-label="QA 참여 인원 진행도"
          aria-valuenow={Math.round(completionRate)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${participantCount}명 / ${qa.slotCapacity}명`}
          className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
        >
          <div
            className="h-full rounded-full bg-rust-600 transition-[width]"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-h4 text-yellow-700">사용 도토리</span>
          <span className="flex items-center gap-1 text-h3 text-yellow-800">
            <Image
              src="/images/acorn.svg"
              alt=""
              aria-hidden
              width={12}
              height={16}
              unoptimized
            />
            {qa.depositAcorn}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {isOwner ? (
            <>
              <Button
                size="medium"
                className="w-full"
                onClick={() =>
                  router.push(`/mypage/my-qa/${qa.feedbackPostId}`)
                }
              >
                진행 상황 자세히 보기
              </Button>
              <Button
                variant="outline"
                size="medium"
                className="w-full"
                disabled={!isRecruiting}
                onClick={() => setIsEarlyCloseDialogOpen(true)}
              >
                {isRecruiting ? '조기 마감하기' : '모집이 종료되었습니다'}
              </Button>
            </>
          ) : (
            canParticipate ? (
              <Tooltip>
                <TooltipTrigger
                  render={<span className="inline-flex w-full" />}
                >
                  {participationButton}
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={16}
                  className="max-w-none px-4 py-3 whitespace-nowrap"
                >
                  참여 후 <span className="text-rust-600">24시간</span> 내에
                  피드백을 제출해야 해요.
                </TooltipContent>
              </Tooltip>
            ) : (
              participationButton
            )
          )}
        </div>
      </section>

      <QaEarlyCloseConfirmDialog
        open={isEarlyCloseDialogOpen}
        onOpenChange={(open) => {
          if (!completeMutation.isPending) {
            setIsEarlyCloseDialogOpen(open);
          }
        }}
        isPending={completeMutation.isPending}
        onConfirm={() => {
          completeMutation.mutate(undefined, {
            onSuccess: () => {
              setIsEarlyCloseDialogOpen(false);
              toast.success('QA 모집을 조기 마감했습니다');
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'QA 모집 조기 마감에 실패했습니다'
              );
            },
          });
        }}
      />

      <QaParticipationConfirmDialog
        open={isParticipationDialogOpen}
        onOpenChange={(open) => {
          if (!participationMutation.isPending) {
            setIsParticipationDialogOpen(open);
          }
        }}
        isPending={participationMutation.isPending}
        onConfirm={() => {
          participationMutation.mutate(undefined, {
            onSuccess: () => {
              setLocalParticipationDeadlineAt(
                Date.now() + QA_PARTICIPATION_DURATION_MS
              );
              setIsParticipationDialogOpen(false);
              toast.success('QA 참여가 완료되었습니다');
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'QA 참여 신청에 실패했습니다'
              );
            },
          });
        }}
      />
    </>
  );
}

function QaDetail({ feedbackPostId, showCreatedToast = false }: QaDetailProps) {
  const [isCreatedToastOpen, setIsCreatedToastOpen] =
    useState(showCreatedToast);
  const qaQuery = useQaRecruitmentDetail(feedbackPostId);
  const projectQuery = useProjectDetail(qaQuery.data?.projectId);

  useEffect(() => {
    if (!showCreatedToast) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('created');
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [showCreatedToast]);

  if (qaQuery.isPending || (qaQuery.data && projectQuery.isPending)) {
    return <QaDetailLoading />;
  }

  if (qaQuery.isError || projectQuery.isError) {
    const error = qaQuery.error ?? projectQuery.error;

    return (
      <QaDetailError
        message={
          error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'
        }
        onRetry={() => {
          void qaQuery.refetch();
          if (qaQuery.data?.projectId) {
            void projectQuery.refetch();
          }
        }}
      />
    );
  }

  if (!qaQuery.data || !projectQuery.data) {
    return null;
  }

  const isOwner = projectQuery.data.isOwner;

  return (
    <>
      <div className="flex items-start gap-10">
        <main className="min-w-0 flex-1">
          <QaDetailCard qa={qaQuery.data} project={projectQuery.data} />
        </main>
        <aside className="w-80 shrink-0">
          <QaRecruitmentStatusCard qa={qaQuery.data} isOwner={isOwner} />
        </aside>
      </div>

      {isCreatedToastOpen ? (
        <ToastLarge
          variant="success"
          title="QA 모집 등록 완료!"
          description={`${qaQuery.data.depositAcorn} 도토리를 사용해 모집 글을 등록했어요.`}
          onClose={() => setIsCreatedToastOpen(false)}
        />
      ) : null}
    </>
  );
}

export { QaDetail };
export type { QaDetailProps };
