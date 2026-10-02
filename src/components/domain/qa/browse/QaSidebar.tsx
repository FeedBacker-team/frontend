'use client';

import { useEffect } from 'react';

import { toast } from '@/components/common/Sonner';
import {
  MyQaStatus,
  MyQaStatusSkeleton,
} from '@/components/domain/qa/browse/MyQaStatus';
import { QaRewardRankings } from '@/components/domain/qa/browse/QaRewardRankings';
import { useProfile } from '@/hooks/useProfile';
import {
  useMyQaParticipations,
  useMyQaRecruitments,
} from '@/hooks/useQaRecruitments';
import { useAuthStore } from '@/stores/authStore';

function QaSidebar() {
  const authStatus = useAuthStore((state) => state.status);
  const isAuthenticated = authStatus === 'authenticated';
  const profileQuery = useProfile({ enabled: isAuthenticated });
  const recruitmentsQuery = useMyQaRecruitments({
    enabled: isAuthenticated,
  });
  const participationsQuery = useMyQaParticipations({
    enabled: isAuthenticated,
  });
  const isStatusLoading =
    authStatus === 'initializing' ||
    (isAuthenticated &&
      (profileQuery.isPending ||
        recruitmentsQuery.isPending ||
        participationsQuery.isPending));
  const hasStatusError =
    profileQuery.isError ||
    recruitmentsQuery.isError ||
    participationsQuery.isError;
  const recruitingCount =
    recruitmentsQuery.data?.filter((qa) => qa.status === 'RECRUITING').length ??
    0;
  const submissionPendingCount =
    participationsQuery.data?.filter((qa) => qa.status === 'WRITING').length ??
    0;
  const reviewingCount =
    participationsQuery.data?.filter((qa) => qa.status === 'SUBMITTED').length ??
    0;

  useEffect(() => {
    if (hasStatusError) {
      toast.error('나의 QA 현황을 불러오지 못했습니다');
    }
  }, [hasStatusError]);

  return (
    <div className="flex flex-col gap-14">
      {isStatusLoading ? <MyQaStatusSkeleton /> : null}
      {isAuthenticated && !isStatusLoading && !hasStatusError ? (
        <MyQaStatus
          nickname={profileQuery.data?.nickname ?? ''}
          recruitingCount={recruitingCount}
          submissionPendingCount={submissionPendingCount}
          reviewingCount={reviewingCount}
        />
      ) : null}
      <QaRewardRankings />
    </div>
  );
}

export { QaSidebar };
