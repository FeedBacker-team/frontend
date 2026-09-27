import { redirect } from 'next/navigation';

import { QaRecruitForm } from '@/components/domain/qa/recruit/QaRecruitForm';
import { MOCK_QA_RECRUITABLE_PROJECTS } from '@/mocks/qa';
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

  const project = MOCK_QA_RECRUITABLE_PROJECTS.find(
    (item) => String(item.projectId) === projectId && !item.hasActiveQa
  );

  if (!project) {
    redirect('/qa');
  }

  return <QaRecruitForm project={project} target={target} />;
}
