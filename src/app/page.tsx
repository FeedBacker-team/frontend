import { HomeBanner } from '@/components/domain/home/HomeBanner';
import { HomeProjectBrowse } from '@/components/domain/home/HomeProjectBrowse';
import {
  RankedList,
  type RankedListItem,
} from '@/components/domain/shared/RankedList';

const MOCK_RANKED_ITEMS: RankedListItem[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: String(index + 1),
    title: '프로젝트 제목',
    description: '프로젝트 설명',
  })
);

export default function Home() {
  return (
    <div className="flex gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <HomeBanner />
        <HomeProjectBrowse />
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-14">
        <RankedList
          title="지금 인기 있는 프로젝트"
          items={MOCK_RANKED_ITEMS}
          skeletonCount={5}
        />
        <RankedList
          title="요즘 뜨는 #AI 분야 프로젝트"
          items={MOCK_RANKED_ITEMS}
          isLoading={true}
          skeletonCount={5}
        />
      </aside>
    </div>
  );
}
