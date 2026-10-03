import { ProjectDetailView } from '@/components/domain/project/ProjectDetailView';

export default async function ProjectDetailPage(
  props: PageProps<'/projects/[projectId]'>
) {
  const { projectId } = await props.params;

  return <ProjectDetailView projectId={projectId} />;
}
