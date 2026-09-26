import { MyQaStatus } from '@/components/domain/qa/MyQaStatus';
import { QaRewardRankings } from '@/components/domain/qa/QaRewardRankings';

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
