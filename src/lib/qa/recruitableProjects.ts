import type { MyProjectItem } from '@/types/mypage';
import type { QaRecruitableProject } from '@/types/qa';

function toQaRecruitableProject(
  project: MyProjectItem
): QaRecruitableProject {
  return {
    projectId: project.id,
    title: project.title,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    hasActiveQa: project.hasActiveQa,
    activeQa: project.activeFeedbackPostId
      ? { feedbackPostId: project.activeFeedbackPostId }
      : null,
  };
}

export { toQaRecruitableProject };
