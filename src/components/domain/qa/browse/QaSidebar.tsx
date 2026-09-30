import { MyQaStatusSkeleton } from '@/components/domain/qa/browse/MyQaStatus';
import { QaRewardRankings } from '@/components/domain/qa/browse/QaRewardRankings';

function QaSidebar() {
  return (
    <div className="flex flex-col gap-14">
      <MyQaStatusSkeleton />
      <QaRewardRankings />
    </div>
  );
}

export { QaSidebar };
