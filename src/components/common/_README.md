# Common Components

## Button

메인·보조·아웃라인 액션 버튼.

### Props

| prop        | type                                        | default     | 설명                 |
| ----------- | ------------------------------------------- | ----------- | -------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'outline'`     | `'primary'` |                      |
| `size`      | `'giant' \| 'large' \| 'medium' \| 'small'` | `'large'`   |                      |
| `leftIcon`  | `ReactNode`                                 | —           | 왼쪽 아이콘 슬롯     |
| `rightIcon` | `ReactNode`                                 | —           | 오른쪽 아이콘 슬롯   |
| `disabled`  | `boolean`                                   | `false`     |                      |
| `className` | `string`                                    | —           | 추가 클래스          |
| …           | `button` attrs                              | —           | `onClick`, `type` 등 |

### 사용 예

```tsx
import { Button } from '@/components/common/button';

// 기본 (primary, large)
<Button>저장</Button>

// variant / size
<Button variant="secondary" size="small">
  취소
</Button>

// 아이콘 (public/icons)
<Button
  leftIcon={<img src="/icons/chevron-left.svg" alt="" aria-hidden />}
  rightIcon={<img src="/icons/chevron-right.svg" alt="" aria-hidden />}
>
  Button
</Button>

// disabled
<Button disabled>비활성</Button>
```

---

## Sonner

상단 중앙에 뜨는 알림. `Toaster`는 루트 레이아웃에 한 번만 둡니다.

### API

| 메서드          | 설명                        |
| --------------- | --------------------------- |
| `toast.error`   | 경고                        |
| `toast.success` | 성공                        |
| `toast.undo`    | 삭제 안내 (실행취소 미구현) |

3초 뒤 자동으로 닫히고, 호버 중에는 타이머가 멈춥니다. X로 바로 닫을 수 있습니다.

### 사용 예

```tsx
import { toast } from '@/components/common/sonner';

toast.error('토스트');
toast.success('토스트');
toast.undo('항목이 삭제되었습니다.');
```

---

## 컴포넌트 목록

| 컴포넌트 | 상태 | 담당   |
| -------- | ---- | ------ |
| Button   | ✅   | 이찬우 |
| Sonner   | ✅   | 이찬우 |
