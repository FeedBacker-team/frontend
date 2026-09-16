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

## Radio

그룹 안에서 하나만 고르는 라디오. 원 + 라벨 + 설명입니다.

### Props

**RadioGroup**

| prop            | type                    | default   | 설명                          |
| --------------- | ----------------------- | --------- | ----------------------------- |
| `size`          | `'large' \| 'medium'`   | `'large'` | 그룹 전체에 적용              |
| `value`         | `string`                | —         | 제어 선택값                   |
| `defaultValue`  | `string`                | —         | 비제어 초기 선택값            |
| `onValueChange` | `(value) => void`       | —         |                               |
| `disabled`      | `boolean`               | `false`   | 그룹 전체 비활성              |
| `className`     | `string`                | —         |                               |

**Radio**

| prop          | type        | default | 설명                         |
| ------------- | ----------- | ------- | ---------------------------- |
| `value`       | `string`    | —       | 항목 값 (필수)               |
| `label`       | `ReactNode` | —       |                              |
| `description` | `ReactNode` | —       | 부가 설명                    |
| `disabled`    | `boolean`   | `false` | 항목 단위. 선택+비활성도 가능 |
| `className`   | `string`    | —       |                              |

### 사용 예

```tsx
import { Radio, RadioGroup } from '@/components/common/radio-group';

<RadioGroup value={value} onValueChange={setValue} size="large">
  <Radio
    value="a"
    label="라디오버튼"
    description="부가적인 설명이 들어갑니다."
  />
  <Radio value="b" label="라디오버튼" description="..." />
  <Radio value="c" label="라디오버튼" description="..." disabled />
</RadioGroup>
```

선택+비활성은 그룹 `value`를 그 항목에 두고 `disabled`를 줍니다.

---

## Dialog

오버레이 위 패널. 화면 종류(`login` 등)로 나누지 않고 Header / Body / Footer 슬롯만 둡니다. 오버레이 클릭과 ESC로는 닫히지 않고, 푸터 버튼으로만 닫습니다.

### Props

**Dialog**

| prop                      | type                      | default | 설명                    |
| ------------------------- | ------------------------- | ------- | ----------------------- |
| `open`                    | `boolean`                 | —       | 제어 열림               |
| `onOpenChange`            | `(open) => void`          | —       |                         |
| `disablePointerDismissal` | `boolean`                 | `true`  | 오버레이 클릭으로 닫기  |

**DialogHeader**

| prop          | type        | default | 설명                         |
| ------------- | ----------- | ------- | ---------------------------- |
| `icon`        | `ReactNode` | —       | 있으면 rust-50 박스에 32px   |
| `title`       | `ReactNode` | —       |                              |
| `description` | `ReactNode` | —       |                              |

**DialogBody** / **DialogFooter** — `className`과 children. 푸터 버튼은 가로로 균등 분배됩니다.

**DialogContent** — 너비는 `className`으로 화면마다 지정합니다. 지정하지 않으면 내용 너비(`w-max`)를 따릅니다.

### 사용 예

```tsx
import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="w-100">
    <DialogHeader
      title="로그인 후 참여할 수 있어요"
      description="로그인 후 이용할 수 있어요."
    />
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        둘러보기
      </Button>
      <Button onClick={() => setOpen(false)}>로그인하기</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 컴포넌트 목록

| 컴포넌트 | 상태 | 담당   |
| -------- | ---- | ------ |
| Button   | ✅   | 이찬우 |
| Sonner   | ✅   | 이찬우 |
| Radio    | ✅   | 이찬우 |
| Dialog   | ✅   | 이찬우 |
