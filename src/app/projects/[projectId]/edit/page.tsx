import type { Metadata } from 'next';

import { ProjectEditView } from '@/components/domain/project/ProjectEditView';
import { createRobotsMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: '프로젝트 수정',
  robots: createRobotsMetadata(false),
};

export default async function ProjectEditPage(
  props: PageProps<'/projects/[projectId]/edit'>
) {
  const { projectId } = await props.params;

  return (
    <div className="w-220 mx-auto">
      <h2 className="text-t2 mb-8">프로젝트 수정하기</h2>
      <ProjectEditView projectId={projectId} />
    </div>
  );
}
