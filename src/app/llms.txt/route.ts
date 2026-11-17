import { SITE_DESCRIPTION, SITE_URL } from '@/constants/metadata';

const LLMS_TXT_CONTENT = `# Feedbacker

> ${SITE_DESCRIPTION}

Feedbacker(피드배커)는 사이드 프로젝트를 만든 메이커들이 서로의 서비스를 테스트하고
QA 피드백을 주고받는 품앗이 플랫폼입니다.

## 주요 페이지

- [프로젝트 둘러보기](${SITE_URL}/): 등록된 사이드 프로젝트 목록과 검색
- [QA 모집](${SITE_URL}/qa): 진행 중인 QA 모집 목록
- [FAQ](${SITE_URL}/faq): 자주 묻는 질문
- [이용약관](${SITE_URL}/terms)
- [개인정보처리방침](${SITE_URL}/privacy)

## 전체 콘텐츠

- [llms-full.txt](${SITE_URL}/llms-full.txt): FAQ·약관을 포함한 전체 콘텐츠 요약
`;

function GET() {
  return new Response(LLMS_TXT_CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export { GET };
