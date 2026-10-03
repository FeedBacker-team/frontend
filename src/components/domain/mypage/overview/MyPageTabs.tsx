'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toast } from '@/components/common/Sonner';
import { MyProjectListItem } from '@/components/domain/mypage/overview/MyProjectListItem';
import { MyQaParticipationDetailDialog } from '@/components/domain/mypage/overview/MyQaParticipationDetailDialog';
import { MyQaParticipationListItem } from '@/components/domain/mypage/overview/MyQaParticipationListItem';
import { MyQaRecruitListItem } from '@/components/domain/mypage/overview/MyQaRecruitListItem';
import { MY_PAGE_TAB_LABEL, MY_PAGE_TAB_ORDER } from '@/constants/mypage';
import { useFeedbackParticipationDetail } from '@/hooks/useFeedback';
import { useMyProjects } from '@/hooks/useProjects';
import { useMyQaParticipations, useMyQaRecruitments } from '@/hooks/useQaRecruitments';
import { mapToMyQaParticipationItem, mapToMyQaRecruitItem } from '@/lib/qa/myQa';
import { cn } from '@/lib/utils';
import { useObjectionStore } from '@/stores/objectionStore';
import type { MyPageTab, MyQaParticipationStatus } from '@/types/mypage';

const TAB_QUERY_KEY = 'tab';

/** 참여자가 실제로 피드백을 제출해 조회 가능한(GET /api/feedbacks/{id}) 상태만 상세 모달을 연다 */
const CLICKABLE_PARTICIPATION_STATUSES: MyQaParticipationStatus[] = [
  'PENDING_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'DISPUTE_REVIEWING',
  'DISPUTE_RESOLVED',
];

type MyPageTabsProps = {
  initialTab?: MyPageTab;
};

function MyPageTabs({ initialTab }: MyPageTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<MyPageTab>(
    initialTab ?? 'PROJECT'
  );
  const [selectedParticipationId, setSelectedParticipationId] = useState<
    string | null
  >(null);
  const participationDetailQuery = useFeedbackParticipationDetail(
    selectedParticipationId
  );
  const filedObjections = useObjectionStore((state) => state.filedByFeedbackId);

  const {
    data: projects,
    isPending: isProjectsPending,
    isError: isProjectsError,
  } = useMyProjects();

  const {
    data: myQaRecruitments,
    isPending: isQaRecruitsPending,
    isError: isQaRecruitsError,
  } = useMyQaRecruitments();
  const qaRecruits = myQaRecruitments?.map(mapToMyQaRecruitItem) ?? [];

  const {
    data: myQaParticipations,
    isPending: isQaParticipationsPending,
    isError: isQaParticipationsError,
  } = useMyQaParticipations();
  const qaParticipations =
    myQaParticipations?.map((participation) =>
      mapToMyQaParticipationItem(
        participation,
        participation.id in filedObjections
      )
    ) ?? [];

  useEffect(() => {
    if (isProjectsError) {
      toast.error('내 프로젝트 목록을 불러오지 못했습니다');
    }
  }, [isProjectsError]);

  useEffect(() => {
    if (isQaRecruitsError) {
      toast.error('내 QA 모집 목록을 불러오지 못했습니다');
    }
  }, [isQaRecruitsError]);

  useEffect(() => {
    if (isQaParticipationsError) {
      toast.error('내 QA 참여 목록을 불러오지 못했습니다');
    }
  }, [isQaParticipationsError]);

  const handleTabChange = (tab: MyPageTab) => {
    setActiveTab(tab);
    router.replace(`${pathname}?${TAB_QUERY_KEY}=${tab}`, { scroll: false });
  };

  const countByTab: Record<MyPageTab, number> = {
    PROJECT: projects?.length ?? 0,
    QA_RECRUIT: qaRecruits.length,
    QA_PARTICIPATION: qaParticipations.length,
  };

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-gray-50 p-8">
      <div
        role="tablist"
        aria-label="마이페이지 활동 내역"
        className="flex border-b border-gray-300"
      >
        {MY_PAGE_TAB_ORDER.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              'flex-1 cursor-pointer pb-4 text-center text-h4 transition-colors',
              activeTab === tab
                ? 'border-b-2 border-rust-600 text-rust-600'
                : 'text-text-disabled'
            )}
          >
            {MY_PAGE_TAB_LABEL[tab]} {countByTab[tab]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <p className="text-c1 text-text-sub">전체 {countByTab[activeTab]}개</p>
        <span aria-hidden className="text-c1 text-text-disabled">
          |
        </span>
        <p className="text-c1 text-text-sub">최신순</p>
      </div>

      {activeTab === 'PROJECT' ? (
        isProjectsPending ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            불러오는 중이에요
          </p>
        ) : isProjectsError ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            내 프로젝트 목록을 불러오지 못했습니다
          </p>
        ) : projects.length === 0 ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            등록한 프로젝트가 없어요
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-300">
            {projects.map((project) => (
              <li key={project.id}>
                <MyProjectListItem project={project} />
              </li>
            ))}
          </ul>
        )
      ) : null}

      {activeTab === 'QA_RECRUIT' ? (
        isQaRecruitsPending ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            불러오는 중이에요
          </p>
        ) : isQaRecruitsError ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            내 QA 모집 목록을 불러오지 못했습니다
          </p>
        ) : qaRecruits.length === 0 ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            등록한 QA 모집이 없어요
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-300">
            {qaRecruits.map((recruit) => (
              <li key={recruit.id}>
                <MyQaRecruitListItem recruit={recruit} />
              </li>
            ))}
          </ul>
        )
      ) : null}

      {activeTab === 'QA_PARTICIPATION' ? (
        isQaParticipationsPending ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            불러오는 중이에요
          </p>
        ) : isQaParticipationsError ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            내 QA 참여 목록을 불러오지 못했습니다
          </p>
        ) : qaParticipations.length === 0 ? (
          <p className="text-b2 py-16 text-center text-text-sub">
            참여한 QA가 없어요
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-300">
            {qaParticipations.map((participation) => (
              <li key={participation.id}>
                <MyQaParticipationListItem
                  participation={participation}
                  onClick={
                    CLICKABLE_PARTICIPATION_STATUSES.includes(
                      participation.status
                    )
                      ? () => setSelectedParticipationId(participation.id)
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        )
      ) : null}

      <MyQaParticipationDetailDialog
        open={selectedParticipationId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedParticipationId(null);
          }
        }}
        detail={participationDetailQuery.data}
        isLoading={participationDetailQuery.isPending}
      />
    </section>
  );
}

export { MyPageTabs };
export type { MyPageTabsProps };
