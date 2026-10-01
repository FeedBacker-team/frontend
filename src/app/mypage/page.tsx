import { MyGrowthSummary } from '@/components/domain/mypage/MyGrowthSummary';
import { MyPageTabs } from '@/components/domain/mypage/MyPageTabs';
import { MyProfileCard } from '@/components/domain/mypage/MyProfileCard';
import {
  isMyPageTab,
  MOCK_MY_QA_PARTICIPATIONS,
  MOCK_MY_QA_RECRUITS,
} from '@/constants/mypage';

export default async function MyPage(props: PageProps<'/mypage'>) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-t2 text-text-default">마이페이지</h1>
      <MyProfileCard />
      <MyGrowthSummary />
      <MyPageTabs
        qaRecruits={MOCK_MY_QA_RECRUITS}
        qaParticipations={MOCK_MY_QA_PARTICIPATIONS}
        initialTab={isMyPageTab(tabParam) ? tabParam : undefined}
      />
    </div>
  );
}
