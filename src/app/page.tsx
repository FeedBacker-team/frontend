import { HomeBanner } from '@/components/domain/home/HomeBanner';
import { HomeProjectBrowse } from '@/components/domain/home/HomeProjectBrowse';
import { HomeRankedProjects } from '@/components/domain/home/HomeRankedProjects';

export default function Home() {
  return (
    <div className="flex gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <HomeBanner />
        <HomeProjectBrowse />
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-14">
        <HomeRankedProjects />
      </aside>
    </div>
  );
}
