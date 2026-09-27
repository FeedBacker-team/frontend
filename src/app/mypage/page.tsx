import { MyGrowthSummary } from '@/components/domain/mypage/MyGrowthSummary';
import { MyPageTabs } from '@/components/domain/mypage/MyPageTabs';
import {
  MyProfileCard,
  type MyProfileCardProps,
} from '@/components/domain/mypage/MyProfileCard';
import {
  isMyPageTab,
  MOCK_ACORN_TRANSACTIONS,
  MOCK_MY_PROJECTS,
  MOCK_MY_QA_PARTICIPATIONS,
  MOCK_MY_QA_RECRUITS,
} from '@/constants/mypage';

const MOCK_PROFILE: MyProfileCardProps = {
  nickname: '닉네임',
  role: 'DEVELOPER',
  introLink: 'https://aibiz.example.com',
  tags: ['WEB', 'B2B_SAAS', 'AI_ML'],
};

const MOCK_GROWTH = {
  acornCount: 100,
  acornTransactions: MOCK_ACORN_TRANSACTIONS,
  humidity: 50,
};

export default async function MyPage(props: PageProps<'/mypage'>) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-t2 text-text-default">마이페이지</h1>
      <MyProfileCard {...MOCK_PROFILE} />
      <MyGrowthSummary {...MOCK_GROWTH} />
      <MyPageTabs
        projects={MOCK_MY_PROJECTS}
        qaRecruits={MOCK_MY_QA_RECRUITS}
        qaParticipations={MOCK_MY_QA_PARTICIPATIONS}
        initialTab={isMyPageTab(tabParam) ? tabParam : undefined}
      />
    </div>
  );
}
