# Shared Domain Components

두 페이지 이상에서 쓰는 조합 컴포넌트입니다. fetch·정렬·API 파라미터는 넣지 않습니다.

## RankedList

제목 + 흰 카드 + 썸네일/제목/설명 행. 홈의 인기·`#`분야 레일, 이후 QA 도토리 리스트에 재사용합니다.

데이터는 호출하는 쪽이 넘깁니다. 지금은 mock, 나중엔 `isLoading`에 Query `isPending`을 넣습니다.

### Props

| prop            | type              | default | 설명                          |
| --------------- | ----------------- | ------- | ----------------------------- |
| `title`         | `string`          | —       | 카드 밖 제목 (`text-h4`)      |
| `items`         | `RankedListItem[]`| —       | 행 데이터. 로딩 중엔 무시     |
| `isLoading`     | `boolean`         | `false` | `true`면 행을 스켈레톤으로    |
| `skeletonCount` | `number`          | `5`     | 스켈레톤 행 수                |
| `className`     | `string`          | —       | 섹션 추가 클래스              |

**RankedListItem**

| field           | type     | 설명                                      |
| --------------- | -------- | ----------------------------------------- |
| `id`            | `string` | key                                       |
| `title`         | `string` | 행 제목 (`text-h4`)                       |
| `description`   | `string` | 행 설명 (`text-b3`). QA 메타는 나중에     |
| `thumbnailUrl`  | `string` | 아직 미사용. 퍼블리싱은 52px 회색 박스    |

### 사용 예

```tsx
import { RankedList } from '@/components/domain/shared/RankedList';

<RankedList
  title="지금 인기 있는 프로젝트"
  items={[
    { id: '1', title: '프로젝트 제목', description: '프로젝트 설명' },
  ]}
/>

// 로딩 (API isPending)
<RankedList title="지금 인기 있는 프로젝트" items={[]} isLoading />
```

---

## BrowseSection

홈 프로젝트 둘러보기 · QA 목록이 같이 쓰는 검색 레이아웃입니다. 카드는 `children`으로 넣습니다. fetch는 넣지 않습니다.

지금은 검색·태그·정렬·페이지를 컴포넌트 안에서만 다룹니다. API 붙일 때 상태로 올리면 됩니다.

`resultCount === 0`이면 `children` 대신 `BrowseEmpty`를 보여주고 페이지네이션은 숨깁니다. 홈/QA 카피는 `emptyTitle`로 받습니다.

### Props

| prop                       | type                | default | 설명 |
| -------------------------- | ------------------- | ------- | ---- |
| `title`                    | `string`            | —       | 영역 제목 |
| `description`              | `string`            | —       | 제목 아래 설명 |
| `action`                   | `ReactNode`         | —       | 오른쪽 CTA. 홈/QA가 다른 버튼을 넣음 |
| `searchPlaceholder`        | `string`            | —       | |
| `tags`                     | `BrowseTag[]`       | —       | `{ value, label }` |
| `maxSelectedTags`          | `number`            | `5`     | |
| `defaultSelectedTagValues` | `string[]`          | `[]`    | 초기 선택 태그 |
| `resultCount`              | `number`            | —       | `검색 결과 n건`. `0`이면 빈 화면 |
| `emptyTitle`               | `string`            | —       | 0건일 때 `BrowseEmpty` 제목 |
| `sortOptions`              | `BrowseSortOption[]`| —       | `{ value, label }` |
| `defaultSortValue`         | `string`            | 첫 옵션 | |
| `children`                 | `ReactNode`         | —       | 카드 리스트 자리. 0건이면 안 그림 |
| `totalPages`               | `number`            | `1`     | |
| `className`                | `string`            | —       | |

### 사용 예

```tsx
import { Button } from '@/components/common/Button';
import { BrowseSection } from '@/components/domain/shared/BrowseSection';

<BrowseSection
  title="프로젝트 둘러보기"
  description="등록된 프로젝트를 살펴보고 다양한 분야의 작업물을 탐색해 보세요."
  action={<Button size="medium">내 프로젝트 등록하기</Button>}
  searchPlaceholder="관심 있는 키워드나 프로젝트를 검색해 보세요"
  tags={[{ value: 'web', label: '#웹' }]}
  resultCount={12}
  emptyTitle="조건에 맞는 프로젝트가 없어요"
  sortOptions={[
    { value: 'latest', label: '최신순' },
    { value: 'views', label: '조회수순' },
  ]}
  totalPages={99}
>
  {/* 홈: ProjectBrowseCard / QA: QaBrowseCard */}
</BrowseSection>
```

---

## BrowseEmpty

검색 결과가 0건일 때 목록 자리에 넣는 빈 화면입니다. `BrowseSection`이 `resultCount === 0`이면 직접 렌더합니다. 페이지에서 따로 부르지 않습니다.

홈·QA가 같은 레이아웃을 쓰고 제목만 다릅니다. 설명·이미지·태그 초기화 버튼은 여기 고정입니다.

태그 상태는 `BrowseSection`이 가지고 있어서, 초기화는 `onResetTags`로 받습니다.

### Props

| prop          | type         | default | 설명 |
| ------------- | ------------ | ------- | ---- |
| `title`       | `string`     | —       | 홈/QA 카피. 예: `조건에 맞는 프로젝트가 없어요` |
| `onResetTags` | `() => void` | —       | 태그 초기화 클릭 |
| `className`   | `string`     | —       | 패널 추가 클래스 |

### 사용 예

```tsx
import { BrowseEmpty } from '@/components/domain/shared/BrowseEmpty';

<BrowseEmpty
  title="조건에 맞는 프로젝트가 없어요"
  onResetTags={() => setSelectedTagValues([])}
/>

// QA
<BrowseEmpty
  title="조건에 맞는 QA 모집 글이 없어요"
  onResetTags={() => setSelectedTagValues([])}
/>
```
