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
