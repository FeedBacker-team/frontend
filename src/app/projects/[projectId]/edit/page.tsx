import { ProjectRegisterForm } from '@/components/domain/project/ProjectRegisterForm';
import type { ProjectFormValues } from '@/types/project';

// API 연결 후 상세 조회 응답으로 교체.
const MOCK_INITIAL_VALUES: ProjectFormValues = {
  title: 'AI 기반 B2B 웹 분석 플랫폼, AI-Biz',
  description: `"데이터 분석가는 없는데, 고객 이탈 원인은 답답하셨나요?"
안녕하세요! B2B SaaS 팀을 위한 AI 웹 분석 솔루션 AI-Biz를 만들고 있는 팀입니다.

대부분의 초기 B2B 팀은 복잡한 GA4를 설치해 두고도 정작 "어느 페이지에서 고객이 이탈하는지", "어떤 기능이 실제 계약으로 이어지는지" 정확히 알기 어렵습니다. 전담 데이터 분석가를 고용하자니 비용 부담이 너무 크고요.
AI-Biz는 이런 고민에서 출발했습니다.

핵심 기능
- AI 이탈 지점 자동 탐지: 유저의 웹 행동 패턴을 실시간 학습해 가장 이탈률이 높은 핵심 구간을 알아서 집어냅니다.
- 실행 중심의 AI 리포트: 복잡한 그래프 대신 "OO 페이지의 CTA 버튼 위치를 변경해보세요"처럼 제품팀이 즉시 행동할 수 있는 리포트를 제공합니다.
- B2B 맞춤 유저 여정 추적: 단순 방문이 아닌 구매 전환 가능성이 높은 리드의 흐름을 집중적으로 분석합니다.`,
  tags: ['WEB', 'AI_ML'],
  image: { name: 'AI-Biz_Logo', type: 'image/png', size: 4 * 1024 * 1024 },
  url: 'https://www.example.com',
};

export default function ProjectEditPage() {
  return (
    <div className="w-220 mx-auto">
      <h2 className="text-t2 mb-8">프로젝트 수정하기</h2>
      <ProjectRegisterForm mode="edit" initialValues={MOCK_INITIAL_VALUES} />
    </div>
  );
}
