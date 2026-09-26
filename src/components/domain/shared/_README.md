# Shared Domain Components

두 페이지 이상에서 쓰는 조합 컴포넌트입니다. fetch, API 파라미터, 도메인별 정렬·필터 로직은 넣지 않습니다.

> `domain/shared`의 컴포넌트를 생성·삭제하거나 공개 props 및 동작을 변경하면 이 문서도 같은 작업에서 갱신합니다.

## RankedList

제목과 흰색 카드 안에 썸네일·제목·보조 콘텐츠 행을 표시합니다. 홈 프로젝트 랭킹과 QA 도토리 랭킹에서 사용합니다.

데이터 호출과 정렬은 사용하는 도메인 컴포넌트가 담당합니다. `thumbnailUrl`이 없으면 52px 회색 플레이스홀더를 표시합니다.

### Props

| prop | type | default | 설명 |
| --- | --- | --- | --- |
| `title` | `string` | — | 카드 밖 제목 |
| `items` | `RankedListItem[]` | — | 표시할 행 데이터 |
| `isLoading` | `boolean` | `false` | 행 대신 스켈레톤 표시 |
| `skeletonCount` | `number` | `5` | 로딩 중 표시할 행 수 |
| `className` | `string` | — | 섹션 추가 클래스 |

**RankedListItem**

| field | type | 설명 |
| --- | --- | --- |
| `id` | `string` | React key |
| `title` | `string` | 행 제목 |
| `description` | `ReactNode` | 설명 문자열 또는 아이콘을 포함한 보조 콘텐츠 |
| `thumbnailUrl` | `string` | 선택적 썸네일 URL |

### 사용 예

```tsx
<RankedList
  title="지금 인기 있는 프로젝트"
  items={[
    {
      id: '1',
      title: '프로젝트 제목',
      description: '프로젝트 설명',
      thumbnailUrl: '/project.png',
    },
  ]}
/>

<RankedList title="지금 인기 있는 프로젝트" items={[]} isLoading />
```

`description`에 도토리 아이콘과 수량처럼 조합된 JSX를 전달할 수도 있습니다.

---

## BrowseCardSkeleton

홈 프로젝트 카드와 QA 모집 카드가 공유하는 로딩 스켈레톤입니다. 썸네일, 텍스트, 메타 정보, 태그 영역의 기본 형태를 유지합니다.

별도 props는 없습니다.

```tsx
import { BrowseCardSkeleton } from '@/components/domain/shared/BrowseCardSkeleton';

<BrowseCardSkeleton />
```

카드 목록에서 사용할 때는 호출부가 필요한 개수만큼 반복 렌더링하고, 목록에 `aria-busy`를 설정합니다.

---

## BrowseSection

홈 프로젝트 둘러보기와 QA 모집 목록이 공유하는 검색·태그·정렬·페이지네이션 레이아웃입니다. 카드 목록은 `children`으로 받습니다.

페이지 이동 UI는 `components/common/Pagination`을 사용하며, 현재 페이지 상태와 변경 함수는 호출부가 소유합니다.

모든 검색·태그·정렬·페이지 상태는 사용하는 도메인 컴포넌트가 관리하는 controlled 구조입니다. 이 컴포넌트는 API 호출이나 실제 필터링·정렬을 수행하지 않습니다.

- 로딩 중에는 `children`을 유지하고 빈 화면과 페이지네이션을 숨깁니다.
- 에러 중에는 빈 화면과 페이지네이션을 숨깁니다. 에러 UI는 `children`에서 처리합니다.
- 정상 상태에서 `resultCount === 0`이면 `BrowseEmpty`를 표시합니다.
- 정상 상태에서 결과가 있으면 페이지네이션을 표시합니다.

### Props

| prop | type | default | 설명 |
| --- | --- | --- | --- |
| `title` | `string` | — | 영역 제목 |
| `description` | `string` | — | 제목 아래 설명 |
| `action` | `ReactNode` | — | 오른쪽 CTA |
| `searchPlaceholder` | `string` | — | 검색 입력 placeholder |
| `keyword` | `string` | — | 검색 입력값 |
| `onKeywordChange` | `(value: string) => void` | — | 검색 입력 변경 |
| `onSearch` | `() => void` | — | 검색 폼 제출 |
| `tags` | `readonly BrowseTag[]` | — | `{ value, label }` 태그 목록 |
| `selectedTagValues` | `string[]` | — | 선택된 태그 값 |
| `onToggleTag` | `(value: string) => void` | — | 태그 선택·해제 |
| `onResetTags` | `() => void` | — | 태그 초기화 |
| `maxSelectedTags` | `number` | `5` | 최대 선택 개수 |
| `resultCount` | `number` | — | 전체 검색 결과 수 |
| `emptyTitle` | `string` | — | 결과가 없을 때 제목 |
| `sortOptions` | `readonly BrowseSortOption[]` | — | `{ value, label }` 정렬 목록 |
| `sortValue` | `string` | — | 선택된 정렬 값 |
| `onSortChange` | `(value: string) => void` | — | 정렬 변경 |
| `children` | `ReactNode` | — | 카드·스켈레톤·에러 목록 |
| `page` | `number` | — | 현재 페이지, 1부터 시작 |
| `totalPages` | `number` | — | 전체 페이지 수 |
| `onPageChange` | `(page: number) => void` | — | 페이지 변경 |
| `isLoading` | `boolean` | `false` | 로딩 상태 |
| `isError` | `boolean` | `false` | 에러 상태 |
| `className` | `string` | — | 섹션 추가 클래스 |

### 사용 예

```tsx
<BrowseSection
  title="모집 중인 QA"
  description="동료들의 프로젝트를 테스트해 보세요."
  searchPlaceholder="관심 있는 프로젝트나 QA를 검색해 보세요"
  keyword={keywordInput}
  onKeywordChange={setKeywordInput}
  onSearch={handleSearch}
  tags={tags}
  selectedTagValues={selectedTags}
  onToggleTag={handleToggleTag}
  onResetTags={handleResetTags}
  resultCount={resultCount}
  emptyTitle="조건에 맞는 QA 모집 글이 없어요"
  sortOptions={sortOptions}
  sortValue={sort}
  onSortChange={handleSortChange}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  isLoading={isPending}
  isError={isError}
>
  {/* QaBrowseCard 목록 또는 BrowseCardSkeleton 목록 */}
</BrowseSection>
```

---

## BrowseEmpty

정상 상태에서 검색 결과가 0건일 때 `BrowseSection`이 목록 대신 표시하는 빈 화면입니다. 페이지에서 직접 호출하지 않습니다.

태그 상태는 사용하는 도메인 컴포넌트가 관리하며, 이 컴포넌트는 전달받은 `onResetTags`를 실행합니다.

### Props

| prop | type | default | 설명 |
| --- | --- | --- | --- |
| `title` | `string` | — | 홈·QA별 빈 결과 제목 |
| `onResetTags` | `() => void` | — | 태그 초기화 버튼 동작 |
| `className` | `string` | — | 패널 추가 클래스 |

```tsx
<BrowseEmpty
  title="조건에 맞는 QA 모집 글이 없어요"
  onResetTags={handleResetTags}
/>
```
