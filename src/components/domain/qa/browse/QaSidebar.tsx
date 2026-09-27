import { MyQaStatus } from '@/components/domain/qa/browse/MyQaStatus';
import { QaRewardRankings } from '@/components/domain/qa/browse/QaRewardRankings';

function QaSidebar() {
  return (
    <div className="flex flex-col gap-14">
      <MyQaStatus
        nickname="닉네임"
        pendingFeedbackCount={1}
        submissionPendingCount={1}
        reviewingCount={2}
      />
      <QaRewardRankings />
    </div>
  );
}

export { QaSidebar };
