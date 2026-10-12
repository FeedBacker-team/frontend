# 공통 훅

API 조회·변경 훅과 여러 화면에서 공유하는 상태 관리 훅을 관리합니다.

## useBrowseQuery

홈 프로젝트 목록과 QA 목록의 검색어, 태그, 정렬, 페이지를 URL 쿼리로 관리합니다.
호출부는 허용하는 정렬 옵션과 기본 정렬 값을 전달합니다.

```tsx
const browse = useBrowseQuery(PROJECT_SORT_OPTIONS, 'LATEST');
```

- `keyword`: 검색 실행 시 확정한 검색어. 입력 중인 `keywordInput`은 로컬 상태입니다.
- `tags`: 태그 값을 쉼표로 연결합니다. 허용된 태그만 중복 없이 최대 5개 적용합니다.
- `sort`: 호출부의 정렬 옵션에 해당하는 값만 적용합니다.
- `page`: 1부터 시작합니다. 누락·음수·소수·숫자가 아닌 값은 1로 처리합니다.
- `search`, `toggleTag`, `resetTags`, `setSort`는 조건 변경과 함께 페이지를 1로 설정합니다.
- `setPage`는 다른 조건을 유지하며 페이지를 변경합니다. API 요청 시 호출부에서 1을 뺍니다.
- Next.js와 연동되는 `history.pushState`를 사용하므로 페이지 전체 재로딩 없이 URL이 변경되며 뒤로/앞으로 이동할 수 있습니다.
- 기존의 다른 쿼리와 해시는 보존합니다. 동일 URL은 방문 기록에 중복 추가하지 않습니다.
- 새로고침·상세에서 뒤로 가기 시 URL의 확정된 검색어, 선택 태그, 정렬, 페이지를 복원합니다.
- `useSearchParams`를 사용하므로 정적 페이지에서 호출하는 목록은 `Suspense`로 감쌉니다.

`BrowseSection`과 `Pagination`은 URL을 직접 다루지 않고 훅의 값과 콜백을 전달받습니다.
실제 데이터 조회는 기존 `useProjects`와 `useQaRecruitments`가 담당합니다.
