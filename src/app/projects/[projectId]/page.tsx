import { HomeRankedProjects } from '@/components/domain/home/HomeRankedProjects';
import { ProjectDetail } from '@/components/domain/project/ProjectDetail';
import { type RankedListItem } from '@/components/domain/shared/RankedList';

const MOCK_RANKED_ITEMS: RankedListItem[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: String(index + 1),
    title: '프로젝트 제목',
    description: '프로젝트 설명',
  })
);

// 인증·API 연결 후 교체.
// 내 글은 MOCK_IS_OWNER=true, MOCK_RECRUITING_QA=undefined 로 변경하면 됩니다.
const MOCK_IS_OWNER = false;
const MOCK_RECRUITING_QA = {
  title: '대시보드 & AI 리포트 화면 UX/UI 피드백',
  slotCapacity: 5,
  endDate: '2026-10-12',
  rewardAcorn: 60,
};

const MOCK_DESCRIPTION = (
  <div className="flex flex-col gap-7">
    <p>
      &quot;데이터 분석가는 없는데, 고객 이탈 원인은 답답하셨나요?&quot;
      <br />
      안녕하세요! B2B SaaS 팀을 위한 AI 웹 분석 솔루션 AI-Biz를 만들고 있는
      팀입니다.
      <br />
      대부분의 초기 B2B 팀은 복잡한 GA4를 설치해 두고도 정작 &quot;어느
      페이지에서 고객이 이탈하는지&quot;, &quot;어떤 기능이 실제 계약으로
      이어지는지&quot; 정확히 알기 어렵습니다. 전담 데이터 분석가를 고용하자니
      비용 부담이 너무 크고요.
      <br />
      AI-Biz는 이런 고민에서 출발했습니다.
      <br />
      핵심 기능
      <br />
      - AI 이탈 지점 자동 탐지: 유저의 웹 행동 패턴을 실시간 학습해 가장
      이탈률이 높은 핵심 구간을 알아서 집어냅니다.
      <br />
      - 실행 중심의 AI 리포트: 복잡한 그래프 대신 &quot;OO 페이지의 CTA 버튼
      위치를 변경해보세요&quot;처럼 제품팀이 즉시 행동할 수 있는 리포트를
      제공합니다.
      <br />- B2B 맞춤 유저 여정 추적: 단순 방문이 아닌 구매 전환 가능성이 높은
      리드의 흐름을 집중적으로 분석합니다.
    </p>
  </div>
);

export default function ProjectDetailPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <ProjectDetail
          title="AI 기반 B2B 웹 분석 플랫폼, AI-Biz"
          tags={['웹', 'AI · ML', 'B2B · SaaS']}
          authorNickname="닉네임"
          publishedAt="2026-09-09"
          viewCount={128}
          url="https://www.example.com"
          description={MOCK_DESCRIPTION}
          isOwner={MOCK_IS_OWNER}
          recruitingQa={MOCK_RECRUITING_QA}
        />
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-14">
        <HomeRankedProjects />
      </aside>
    </div>
  );
}
