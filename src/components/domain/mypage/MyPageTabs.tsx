'use client';

import { useState } from 'react';

import { MyProjectListItem } from '@/components/domain/mypage/MyProjectListItem';
import { MyQaParticipationListItem } from '@/components/domain/mypage/MyQaParticipationListItem';
import { MyQaRecruitListItem } from '@/components/domain/mypage/MyQaRecruitListItem';
import { cn } from '@/lib/utils';
import type {
  MyProjectItem,
  MyQaParticipationItem,
  MyQaRecruitItem,
} from '@/types/mypage';

type MyPageTab = 'PROJECT' | 'QA_RECRUIT' | 'QA_PARTICIPATION';

const TAB_LABEL: Record<MyPageTab, string> = {
  PROJECT: '내 프로젝트',
  QA_RECRUIT: '내 QA 모집',
  QA_PARTICIPATION: '내 QA 참여',
};

const TAB_ORDER: MyPageTab[] = ['PROJECT', 'QA_RECRUIT', 'QA_PARTICIPATION'];

type MyPageTabsProps = {
  projects: MyProjectItem[];
  qaRecruits: MyQaRecruitItem[];
  qaParticipations: MyQaParticipationItem[];
};

function MyPageTabs({
  projects,
  qaRecruits,
  qaParticipations,
}: MyPageTabsProps) {
  const [activeTab, setActiveTab] = useState<MyPageTab>('PROJECT');

  const countByTab: Record<MyPageTab, number> = {
    PROJECT: projects.length,
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
        {TAB_ORDER.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 cursor-pointer pb-4 text-center text-h4 transition-colors',
              activeTab === tab
                ? 'border-b-2 border-rust-600 text-rust-600'
                : 'text-text-disabled'
            )}
          >
            {TAB_LABEL[tab]} {countByTab[tab]}
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
        <ul className="flex flex-col divide-y divide-gray-300">
          {projects.map((project) => (
            <li key={project.id}>
              <MyProjectListItem project={project} />
            </li>
          ))}
        </ul>
      ) : null}

      {activeTab === 'QA_RECRUIT' ? (
        <ul className="flex flex-col divide-y divide-gray-300">
          {qaRecruits.map((recruit) => (
            <li key={recruit.id}>
              <MyQaRecruitListItem recruit={recruit} />
            </li>
          ))}
        </ul>
      ) : null}

      {activeTab === 'QA_PARTICIPATION' ? (
        <ul className="flex flex-col divide-y divide-gray-300">
          {qaParticipations.map((participation) => (
            <li key={participation.id}>
              <MyQaParticipationListItem participation={participation} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export { MyPageTabs };
export type { MyPageTabsProps };
