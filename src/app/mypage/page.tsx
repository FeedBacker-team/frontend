import { MyGrowthSummary } from '@/components/domain/mypage/MyGrowthSummary';
import { MyPageTabs } from '@/components/domain/mypage/MyPageTabs';
import { MyProfileCard } from '@/components/domain/mypage/MyProfileCard';
import {
  MOCK_ACORN_TRANSACTIONS,
  MOCK_MY_PROJECTS,
  MOCK_MY_QA_PARTICIPATIONS,
  MOCK_MY_QA_RECRUITS,
} from '@/constants/mypage';

const MOCK_PROFILE = {
  nickname: '닉네임',
  role: '개발자',
  introLink: 'https://aibiz.example.com',
  tags: ['웹', 'B2B', 'AI · ML'],
};

const MOCK_GROWTH = {
  acornCount: 100,
  acornTransactions: MOCK_ACORN_TRANSACTIONS,
  humidity: 50,
};

export default function MyPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-t2 text-text-default">마이페이지</h1>
      <MyProfileCard {...MOCK_PROFILE} />
      <MyGrowthSummary {...MOCK_GROWTH} />
      <MyPageTabs
        projects={MOCK_MY_PROJECTS}
        qaRecruits={MOCK_MY_QA_RECRUITS}
        qaParticipations={MOCK_MY_QA_PARTICIPATIONS}
      />
    </div>
  );
}
