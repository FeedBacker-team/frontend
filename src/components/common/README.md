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

## 컴포넌트 목록

| 컴포넌트      | 상태 | 담당 |
| ------------- | ---- | ---- |
| Button        | ✅   | —    |
| _(추가 예정)_ |      |      |
