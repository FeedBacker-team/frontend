import { DEFAULT_PROJECT_PAGE_SIZE } from '@/constants/project';
import type {
  ProjectCard,
  ProjectListParams,
  ProjectListResponse,
  ProjectSort,
  ProjectTag,
} from '@/types/project';

const MOCK_PROJECTS: ProjectCard[] = [
  {
    project_id: 1,
    title: 'AI 기반 B2B 웹 분석 플랫폼, AI-Biz',
    description:
      '어떤 서비스인가요? 주요 기능과 특징을 자유롭게 적어주세요.',
    thumbnail_url: null,
    tags: ['WEB', 'B2B_SAAS', 'AI_ML', 'DATA'],
    created_at: '2026-09-09',
    view_count: 128,
  },
  {
    project_id: 2,
    title: '핀테크 결제 대시보드',
    description: '실시간 결제 내역과 정산 리포트를 한눈에 확인하세요.',
    thumbnail_url: null,
    tags: ['WEB', 'FINTECH', 'DATA', 'B2B_SAAS'],
    created_at: '2026-09-08',
    view_count: 95,
  },
  {
    project_id: 3,
    title: 'AI 추천 쇼핑 앱',
    description: '개인화 추천으로 쇼핑 경험을 개선하는 모바일 앱입니다.',
    thumbnail_url: null,
    tags: ['APP', 'COMMERCE', 'AI_ML', 'UXUI'],
    created_at: '2026-09-07',
    view_count: 210,
  },
  {
    project_id: 4,
    title: '클라우드 인프라 모니터링',
    description: '분산 서버 상태를 실시간으로 추적하는 DevOps 도구입니다.',
    thumbnail_url: null,
    tags: ['CLOUD', 'B2B_SAAS', 'DATA', 'SECURITY'],
    created_at: '2026-09-06',
    view_count: 76,
  },
  {
    project_id: 5,
    title: '데이터 시각화 스튜디오',
    description: '코드 없이 차트와 대시보드를 만들 수 있는 웹 서비스입니다.',
    thumbnail_url: null,
    tags: ['WEB', 'DATA', 'PRODUCTIVITY', 'UXUI'],
    created_at: '2026-09-05',
    view_count: 154,
  },
  {
    project_id: 6,
    title: 'UXUI 디자인 시스템',
    description: '팀 협업을 위한 컴포넌트 라이브러리와 가이드라인입니다.',
    thumbnail_url: null,
    tags: ['UXUI', 'PRODUCTIVITY', 'WEB', 'B2B_SAAS'],
    created_at: '2026-09-04',
    view_count: 88,
  },
  {
    project_id: 7,
    title: '게임 커뮤니티 플랫폼',
    description: '게이머들이 모여 공략과 후기를 공유하는 커뮤니티입니다.',
    thumbnail_url: null,
    tags: ['GAME', 'CONTENT_MEDIA', 'WEB', 'GLOBAL'],
    created_at: '2026-09-03',
    view_count: 312,
  },
  {
    project_id: 8,
    title: '헬스케어 예약 서비스',
    description: '병원 예약부터 진료 기록까지 관리하는 건강 관리 앱입니다.',
    thumbnail_url: null,
    tags: ['APP', 'HEALTHCARE', 'AI_ML', 'UXUI'],
    created_at: '2026-09-02',
    view_count: 67,
  },
  {
    project_id: 9,
    title: '보안 취약점 스캐너',
    description: '웹 애플리케이션 보안 점검을 자동화하는 B2B 솔루션입니다.',
    thumbnail_url: null,
    tags: ['WEB', 'SECURITY', 'B2B_SAAS', 'CLOUD'],
    created_at: '2026-09-01',
    view_count: 143,
  },
  {
    project_id: 10,
    title: '글로벌 번역 API 허브',
    description: '다국어 콘텐츠 배포를 위한 번역 API 통합 플랫폼입니다.',
    thumbnail_url: null,
    tags: ['GLOBAL', 'B2B_SAAS', 'AI_ML', 'CONTENT_MEDIA'],
    created_at: '2026-08-31',
    view_count: 52,
  },
  {
    project_id: 11,
    title: 'AI 문서 요약 도구',
    description: '긴 문서를 핵심만 추출해 요약해 주는 AI 생산성 도구입니다.',
    thumbnail_url: null,
    tags: ['AI_ML', 'PRODUCTIVITY', 'WEB', 'DATA'],
    created_at: '2026-08-30',
    view_count: 189,
  },
  {
    project_id: 12,
    title: '미디어 콘텐츠 CMS',
    description: '영상·기사 콘텐츠를 관리하고 배포하는 CMS입니다.',
    thumbnail_url: null,
    tags: ['CONTENT_MEDIA', 'WEB', 'CLOUD', 'PRODUCTIVITY'],
    created_at: '2026-08-29',
    view_count: 41,
  },
  {
    project_id: 13,
    title: 'AI 챗봇 빌더',
    description: '코드 없이 AI 챗봇을 만들고 배포할 수 있는 SaaS입니다.',
    thumbnail_url: null,
    tags: ['AI_ML', 'B2B_SAAS', 'WEB', 'PRODUCTIVITY'],
    created_at: '2026-08-28',
    view_count: 275,
  },
  {
    project_id: 14,
    title: '커머스 재고 관리',
    description: '온·오프라인 재고를 통합 관리하는 커머스 백오피스입니다.',
    thumbnail_url: null,
    tags: ['COMMERCE', 'DATA', 'B2B_SAAS', 'WEB'],
    created_at: '2026-08-27',
    view_count: 63,
  },
  {
    project_id: 15,
    title: '모바일 핀테크 가계부',
    description: '소비 패턴을 AI로 분석해 알려 주는 가계부 앱입니다.',
    thumbnail_url: null,
    tags: ['APP', 'FINTECH', 'AI_ML', 'DATA'],
    created_at: '2026-08-26',
    view_count: 198,
  },
  {
    project_id: 16,
    title: '글로벌 원격 진료 플랫폼',
    description: '해외 의료진과 화상으로 진료를 연결하는 헬스케어 서비스입니다.',
    thumbnail_url: null,
    tags: ['HEALTHCARE', 'GLOBAL', 'APP', 'SECURITY'],
    created_at: '2026-08-25',
    view_count: 231,
  },
  {
    project_id: 17,
    title: '인디게임 스토어',
    description: '인디 게임을 홍보하고 판매하는 크리에이터 커머스입니다.',
    thumbnail_url: null,
    tags: ['GAME', 'COMMERCE', 'CONTENT_MEDIA', 'GLOBAL'],
    created_at: '2026-08-24',
    view_count: 174,
  },
  {
    project_id: 18,
    title: '클라우드 비용 최적화',
    description: '멀티 클라우드 지출을 분석하고 절감 포인트를 제안합니다.',
    thumbnail_url: null,
    tags: ['CLOUD', 'DATA', 'FINTECH', 'B2B_SAAS'],
    created_at: '2026-08-23',
    view_count: 109,
  },
  {
    project_id: 19,
    title: '생산성 타임트래커',
    description: '업무 시간을 기록하고 집중 패턴을 리포트로 보여 줍니다.',
    thumbnail_url: null,
    tags: ['PRODUCTIVITY', 'APP', 'DATA', 'UXUI'],
    created_at: '2026-08-22',
    view_count: 86,
  },
  {
    project_id: 20,
    title: '시큐어 파일 공유함',
    description: '암호화된 파일 전송과 접근 권한을 관리하는 보안 툴입니다.',
    thumbnail_url: null,
    tags: ['SECURITY', 'CLOUD', 'B2B_SAAS', 'PRODUCTIVITY'],
    created_at: '2026-08-21',
    view_count: 247,
  },
  {
    project_id: 21,
    title: '숏폼 영상 편집 앱',
    description: '모바일에서 자막·컷 편집까지 한 번에 끝내는 영상 도구입니다.',
    thumbnail_url: null,
    tags: ['APP', 'CONTENT_MEDIA', 'AI_ML', 'UXUI'],
    created_at: '2026-08-20',
    view_count: 301,
  },
  {
    project_id: 22,
    title: '리테일 수요 예측',
    description: '매장별 판매 데이터를 학습해 발주량을 예측합니다.',
    thumbnail_url: null,
    tags: ['COMMERCE', 'AI_ML', 'DATA', 'B2B_SAAS'],
    created_at: '2026-08-19',
    view_count: 118,
  },
  {
    project_id: 23,
    title: '크로스보더 정산 월렛',
    description: '해외 판매 대금을 여러 통화로 정산하는 핀테크 월렛입니다.',
    thumbnail_url: null,
    tags: ['FINTECH', 'GLOBAL', 'COMMERCE', 'APP'],
    created_at: '2026-08-18',
    view_count: 159,
  },
  {
    project_id: 24,
    title: '디자인 핸드오프 보드',
    description: '디자이너와 개발자가 스펙을 주고받는 UXUI 협업 보드입니다.',
    thumbnail_url: null,
    tags: ['UXUI', 'WEB', 'PRODUCTIVITY', 'CLOUD'],
    created_at: '2026-08-17',
    view_count: 72,
  },
  {
    project_id: 25,
    title: 'e스포츠 하이라이트 AI',
    description: '경기 영상을 분석해 하이라이트 클립을 자동 생성합니다.',
    thumbnail_url: null,
    tags: ['GAME', 'AI_ML', 'CONTENT_MEDIA', 'DATA'],
    created_at: '2026-08-16',
    view_count: 264,
  },
];

type NormalizedProjectListParams = {
  keyword?: string;
  tags?: ProjectTag[];
  sort: ProjectSort;
  page: number;
  size: number;
};

function normalizeProjectListParams(
  params: ProjectListParams
): NormalizedProjectListParams {
  return {
    keyword: params.keyword?.trim() || undefined,
    tags: params.tags?.length ? params.tags : undefined,
    sort: params.sort ?? 'LATEST',
    page: params.page ?? 0,
    size: params.size ?? DEFAULT_PROJECT_PAGE_SIZE,
  };
}

function buildProjectListQuery(params: NormalizedProjectListParams) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }

  if (params.tags?.length) {
    searchParams.set('tags', params.tags.join(','));
  }

  searchParams.set('sort', params.sort);
  searchParams.set('page', String(params.page));
  searchParams.set('size', String(params.size));

  return searchParams.toString();
}

function sortProjects(
  projects: ProjectCard[],
  sort: ProjectSort
): ProjectCard[] {
  const sorted = [...projects];

  if (sort === 'VIEW_COUNT') {
    return sorted.sort((a, b) => b.view_count - a.view_count);
  }

  return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function filterMockProjects(
  projects: ProjectCard[],
  params: NormalizedProjectListParams
) {
  let filtered = projects;

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();

    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(keyword) ||
        project.description.toLowerCase().includes(keyword)
    );
  }

  if (params.tags?.length) {
    filtered = filtered.filter((project) =>
      params.tags!.every((tag) => project.tags.includes(tag))
    );
  }

  return sortProjects(filtered, params.sort);
}

function getMockProjectList(
  params: NormalizedProjectListParams
): ProjectListResponse {
  const filtered = filterMockProjects(MOCK_PROJECTS, params);
  const start = params.page * params.size;
  const end = start + params.size;

  return {
    total_count: filtered.length,
    page: params.page,
    size: params.size,
    has_next: end < filtered.length,
    projects: filtered.slice(start, end),
  };
}

async function getProjects(
  params: ProjectListParams = {}
): Promise<ProjectListResponse> {
  const normalized = normalizeProjectListParams(params);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockProjectList(normalized);
  }

  const query = buildProjectListQuery(normalized);
  const response = await fetch(`${apiBaseUrl}/api/projects?${query}`);

  if (!response.ok) {
    throw new Error('프로젝트 목록을 불러오지 못했습니다');
  }

  return response.json();
}

export { getProjects };
