import { RequireCompletedProfile } from '@/components/domain/auth/RequireCompletedProfile';
import { ProjectRegisterForm } from '@/components/domain/project/ProjectRegisterForm';

export default function ProjectNewPage() {
  return (
    <RequireCompletedProfile fallbackHref="/">
      <div className="w-220 mx-auto">
        <h2 className="text-t2 mb-8">프로젝트 등록하기</h2>
        <ProjectRegisterForm />
      </div>
    </RequireCompletedProfile>
  );
}
