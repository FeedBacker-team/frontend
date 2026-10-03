import { ProjectEditView } from '@/components/domain/project/ProjectEditView';

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
