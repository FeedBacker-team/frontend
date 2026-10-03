import { MyGrowthSummary } from '@/components/domain/mypage/overview/MyGrowthSummary';
import { MyPageTabs } from '@/components/domain/mypage/overview/MyPageTabs';
import { MyProfileCard } from '@/components/domain/mypage/overview/MyProfileCard';
import { isMyPageTab } from '@/constants/mypage';

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
      <MyPageTabs initialTab={isMyPageTab(tabParam) ? tabParam : undefined} />
    </div>
  );
}
