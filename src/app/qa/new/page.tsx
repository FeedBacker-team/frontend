import { redirect } from 'next/navigation';

import { RequireCompletedProfile } from '@/components/domain/auth/RequireCompletedProfile';
import { QaRecruitNewView } from '@/components/domain/qa/recruit/QaRecruitNewView';
import type { QaTargetType } from '@/types/qa';

type QaRecruitNewPageProps = {
  searchParams: Promise<{
    projectId?: string | string[];
    target?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

function isQaTargetType(value: string | undefined): value is QaTargetType {
  return value === 'SERVICE_LINK' || value === 'IMAGE';
}

export default async function QaRecruitNewPage({
  searchParams,
}: QaRecruitNewPageProps) {
  const params = await searchParams;
  const projectId = getSingleValue(params.projectId);
  const target = getSingleValue(params.target);

  if (!projectId || !isQaTargetType(target)) {
    redirect('/qa');
  }

  return (
    <RequireCompletedProfile fallbackHref="/qa">
      <QaRecruitNewView projectId={projectId} target={target} />
    </RequireCompletedProfile>
  );
}
