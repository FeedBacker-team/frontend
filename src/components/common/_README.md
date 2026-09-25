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
import { Button } from '@/components/common/Button';

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

## Badge

상태, 분류, 남은 기간 등의 짧은 정보를 표시하는 비상호작용 라벨입니다.

### Props

| prop        | type                                         | default     | 설명                      |
| ----------- | -------------------------------------------- | ----------- | ------------------------- |
| `variant`   | `'default' \| 'green' \| 'rust' \| 'yellow'` | `'default'` | Badge의 색상 종류         |
| `icon`      | `ReactNode`                                  | —           | 텍스트 앞에 표시할 아이콘 |
| `className` | `string`                                     | —           | 추가 클래스               |
| `children`  | `ReactNode`                                  | —           | 표시할 내용               |
| …           | `span` attrs                                 | —           | `aria-label` 등           |

### 사용 예

```tsx
import Image from 'next/image';

import { Badge } from '@/components/common/Badge';

<Badge>이미지형</Badge>

<Badge variant="green">D-4</Badge>

<Badge variant="rust">D-2</Badge>

<Badge
  variant="yellow"
  icon={
    <Image
      src="/images/acorn.svg"
      alt=""
      width={17}
      height={17}
      aria-hidden
    />
  }
>
  60
</Badge>
```

`Badge`는 클릭이나 선택 기능이 없는 정보 표시용 컴포넌트입니다. 사용자 입력이 필요한 경우에는 `Button`, `Chip` 또는 `Tag`를 사용합니다.

아이콘은 `icon` prop으로 전달합니다. 장식용 아이콘은 `alt=""`와 `aria-hidden`을 지정해 스크린 리더에서 중복으로 읽히지 않도록 합니다.

---

## Tooltip

요소를 호버하거나 키보드로 포커스했을 때 짧은 설명을 표시합니다. 기본 방향은 trigger 아래쪽이며, Tooltip 상단에 화살표가 표시됩니다.

### Props

**TooltipProvider**

| prop    | type     | default | 설명                   |
| ------- | -------- | ------- | ---------------------- |
| `delay` | `number` | `0`     | Tooltip 표시 지연 시간 |

**Tooltip** — Tooltip의 열림 상태를 관리하는 root입니다.

**TooltipTrigger** — hover와 focus를 감지할 요소입니다. `render`로 실제 trigger 요소를 지정할 수 있습니다.

**TooltipContent**

| prop          | type                                            | default    | 설명                    |
| ------------- | ----------------------------------------------- | ---------- | ----------------------- |
| `side`        | `'top' \| 'bottom' \| 'left' \| 'right' \| ...` | `'bottom'` | Tooltip이 표시될 방향   |
| `sideOffset`  | `number`                                        | `4`        | trigger와의 간격        |
| `align`       | `'start' \| 'center' \| 'end'`                  | `'center'` | trigger 기준 정렬       |
| `alignOffset` | `number`                                        | `0`        | 정렬 위치의 추가 이동값 |
| `className`   | `string`                                        | —          | 추가 클래스             |
| `children`    | `ReactNode`                                     | —          | 표시할 설명             |

### Provider 설정

`TooltipProvider`는 루트 레이아웃에 한 번만 둡니다.

```tsx
import { TooltipProvider } from '@/components/common/Tooltip';

<TooltipProvider>{children}</TooltipProvider>;
```

### 사용 예

```tsx
import { Button } from '@/components/common/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/common/Tooltip';

<Tooltip>
  <TooltipTrigger render={<button type="button" />}>도움말</TooltipTrigger>
  <TooltipContent>tooltip</TooltipContent>
</Tooltip>

// disabled 요소는 hover 이벤트를 받지 않으므로 wrapper를 trigger로 사용합니다.
<Tooltip>
  <TooltipTrigger render={<span className="inline-flex" />}>
    <Button disabled>툴팁 보기</Button>
  </TooltipTrigger>
  <TooltipContent>tooltip</TooltipContent>
</Tooltip>
```

Tooltip 내용은 짧고 명확하게 작성합니다. 클릭해야 확인할 수 있는 중요한 정보나 긴 설명에는 사용하지 않습니다.

---

## Dropdown

목록에서 하나의 값을 선택하는 드롭다운입니다. 기본 상태, 선택 상태와 비활성 상태를 지원합니다.

### Props

**Dropdown**

| prop            | type                              | default | 설명               |
| --------------- | --------------------------------- | ------- | ------------------ |
| `value`         | `string`                          | —       | 제어 선택값        |
| `defaultValue`  | `string`                          | —       | 비제어 초기 선택값 |
| `onValueChange` | `(value: string \| null) => void` | —       | 값 변경 시 호출    |
| `disabled`      | `boolean`                         | `false` | 전체 비활성화      |

**DropdownTrigger** — 현재 값과 열림 상태를 표시하는 버튼입니다.

**DropdownValue** — Trigger에 표시할 텍스트입니다.

**DropdownContent**

| prop         | type                                            | default    | 설명                  |
| ------------ | ----------------------------------------------- | ---------- | --------------------- |
| `side`       | `'top' \| 'bottom' \| 'left' \| 'right' \| ...` | `'bottom'` | 목록이 표시될 방향    |
| `sideOffset` | `number`                                        | `0`        | Trigger와 목록의 간격 |
| `align`      | `'start' \| 'center' \| 'end'`                  | `'start'`  | Trigger 기준 정렬     |
| `className`  | `string`                                        | —          | 추가 클래스           |

**DropdownItem**

| prop       | type        | default | 설명                 |
| ---------- | ----------- | ------- | -------------------- |
| `value`    | `string`    | —       | 선택값 (필수)        |
| `disabled` | `boolean`   | `false` | 해당 옵션 비활성화   |
| `children` | `ReactNode` | —       | 화면에 표시할 텍스트 |

### 사용 예

```tsx
'use client';

import { useState } from 'react';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from '@/components/common/Dropdown';

const [value, setValue] = useState<string | null>(null);

<Dropdown value={value} onValueChange={setValue}>
  <DropdownTrigger>
    <DropdownValue placeholder="선택해주세요" />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem value="single">객관식 - 단일선택</DropdownItem>
    <DropdownItem value="multiple">객관식 - 복수선택</DropdownItem>
    <DropdownItem value="subjective">주관식</DropdownItem>
  </DropdownContent>
</Dropdown>

// 전체 비활성
<Dropdown disabled>
  <DropdownTrigger>
    <DropdownValue placeholder="선택해주세요" />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem value="single">객관식 - 단일선택</DropdownItem>
  </DropdownContent>
</Dropdown>
```

폼에서 사용할 때는 `value`와 `onValueChange`를 연결합니다. 옵션의 `value`는 중복되지 않는 안정적인 값으로 지정합니다.

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
import { toast } from '@/components/common/Sonner';

toast.error('토스트');
toast.success('토스트');
toast.undo('항목이 삭제되었습니다.');
```

---

## ToastLarge

QA 모집 등록 완료, 새 피드백 도착 등 사용자에게 결과를 알리는 알림 카드입니다. 화면 우하단에 고정 표시됩니다.

### Props

| prop          | type                    | default     | 설명                                         |
| ------------- | ----------------------- | ----------- | -------------------------------------------- |
| `variant`     | `'success' \| 'notice'` | `'success'` | `success`는 green, `notice`는 yellow 톤      |
| `title`       | `ReactNode`             | —           | 제목 (필수)                                  |
| `description` | `ReactNode`             | —           | 본문                                         |
| `icon`        | `ReactNode`             | —           | 왼쪽 아이콘. 없으면 variant 기본 아이콘 사용 |
| `onClose`     | `() => void`            | —           | X 버튼 클릭 시 호출 (필수)                   |
| `className`   | `string`                | —           | 추가 클래스                                  |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { ToastLarge } from '@/components/common/ToastLarge';

const [showQaToast, setShowQaToast] = useState(true);

{
  showQaToast && (
    <ToastLarge
      variant="success"
      title="QA 모집 등록 완료!"
      description="100 도토리를 사용해 모집 글을 등록했어요 · 잔여 도토리 40"
      onClose={() => setShowQaToast(false)}
    />
  );
}

// 새 피드백 도착 알림 (기본 아이콘: bell)
<ToastLarge
  variant="notice"
  title="새로운 피드백 3건이 도착했어요!"
  description="제출된 피드백은 72시간 내에 수락 여부를 결정해 주세요."
  onClose={() => setShowFeedbackToast(false)}
/>;
```

---

## CheckBox

체크박스 + 라벨 + 부가설명. `Radio`와 달리 그룹 없이 각 항목을 독립적으로 사용하며(체크 여부가 서로 영향을 주지 않음), 라벨·부가설명 색상은 체크·비활성 여부와 상관없이 고정입니다.

### Props

| prop              | type                       | default   | 설명                           |
| ----------------- | -------------------------- | --------- | ------------------------------ |
| `size`            | `'large' \| 'medium'`      | `'large'` |                                |
| `checked`         | `boolean`                  | —         | 제어 값                        |
| `defaultChecked`  | `boolean`                  | `false`   | 비제어 초기값                  |
| `onCheckedChange` | `(checked) => void`        | —         |                                |
| `disabled`        | `boolean`                  | `false`   |                                |
| `label`           | `ReactNode`                | —         |                                |
| `description`     | `ReactNode`                | —         | 부가 설명                      |
| `className`       | `string`                   | —         |                                |
| …                 | `Checkbox` primitive attrs | —         | `name`, `value`, `required` 등 |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { CheckBox } from '@/components/common/CheckBox';

const [checked, setChecked] = useState(false);

<CheckBox
  checked={checked}
  onCheckedChange={setChecked}
  label="체크박스"
  description="부가적인 설명이 들어갑니다."
/>

// 크기
<CheckBox size="medium" label="체크박스" description="부가적인 설명이 들어갑니다." />

// 비활성
<CheckBox disabled label="체크박스" description="부가적인 설명이 들어갑니다." />
<CheckBox disabled defaultChecked label="체크박스" description="부가적인 설명이 들어갑니다." />

// 라벨 없이 단독 사용
<CheckBox checked={checked} onCheckedChange={setChecked} />
```

---

## Radio

그룹 안에서 하나만 고르는 라디오. 원 + 라벨 + 설명입니다.

### Props

**RadioGroup**

| prop            | type                  | default   | 설명               |
| --------------- | --------------------- | --------- | ------------------ |
| `size`          | `'large' \| 'medium'` | `'large'` | 그룹 전체에 적용   |
| `value`         | `string`              | —         | 제어 선택값        |
| `defaultValue`  | `string`              | —         | 비제어 초기 선택값 |
| `onValueChange` | `(value) => void`     | —         |                    |
| `disabled`      | `boolean`             | `false`   | 그룹 전체 비활성   |
| `className`     | `string`              | —         |                    |

**Radio**

| prop          | type        | default | 설명                          |
| ------------- | ----------- | ------- | ----------------------------- |
| `value`       | `string`    | —       | 항목 값 (필수)                |
| `label`       | `ReactNode` | —       |                               |
| `description` | `ReactNode` | —       | 부가 설명                     |
| `disabled`    | `boolean`   | `false` | 항목 단위. 선택+비활성도 가능 |
| `className`   | `string`    | —       |                               |

### 사용 예

```tsx
import { Radio, RadioGroup } from '@/components/common/RadioGroup';

<RadioGroup value={value} onValueChange={setValue} size="large">
  <Radio
    value="a"
    label="라디오버튼"
    description="부가적인 설명이 들어갑니다."
  />
  <Radio value="b" label="라디오버튼" description="..." />
  <Radio value="c" label="라디오버튼" description="..." disabled />
</RadioGroup>;
```

선택+비활성은 그룹 `value`를 그 항목에 두고 `disabled`를 줍니다.

---

## Dialog

오버레이 위 패널. 화면 종류(`login` 등)로 나누지 않고 Header / Body / Footer 슬롯만 둡니다. 오버레이 클릭과 ESC로는 닫히지 않고, 푸터 버튼으로만 닫습니다.

### Props

**Dialog**

| prop                      | type             | default | 설명                   |
| ------------------------- | ---------------- | ------- | ---------------------- |
| `open`                    | `boolean`        | —       | 제어 열림              |
| `onOpenChange`            | `(open) => void` | —       |                        |
| `disablePointerDismissal` | `boolean`        | `true`  | 오버레이 클릭으로 닫기 |

**DialogHeader**

| prop          | type        | default | 설명                       |
| ------------- | ----------- | ------- | -------------------------- |
| `icon`        | `ReactNode` | —       | 있으면 rust-50 박스에 32px |
| `title`       | `ReactNode` | —       |                            |
| `description` | `ReactNode` | —       |                            |

**DialogBody** / **DialogFooter** — `className`과 children. 푸터 버튼은 가로로 균등 분배됩니다.

**DialogContent** — 너비는 `className`으로 화면마다 지정합니다. 지정하지 않으면 내용 너비(`w-max`)를 따릅니다.

### 사용 예

```tsx
import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';

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
</Dialog>;
```

---

## Calendar

`react-day-picker`를 감싼 날짜 선택기. locale은 `ko`로 고정되어 있고, 헤더 문구(`y년 M월`)도 기본으로 적용됩니다.

### Props

`DayPicker`의 모든 props를 그대로 받습니다. 자주 쓰는 것만 정리합니다.

| prop              | type                                | default     | 설명                                           |
| ----------------- | ----------------------------------- | ----------- | ---------------------------------------------- |
| `mode`            | `'single' \| 'multiple' \| 'range'` | —           | 하나만 고를지, 여러 개 고를지, 기간으로 고를지 |
| `selected`        | 모드에 따라 다름                    | —           | 현재 선택된 날짜(들)                           |
| `onSelect`        | 모드에 따라 다름                    | —           | 날짜를 클릭했을 때 실행할 함수                 |
| `buttonVariant`   | `Button`의 `variant`                | `'outline'` | 이전/다음 버튼 스타일                          |
| `captionLayout`   | `'label' \| 'dropdown' \| ...`      | `'label'`   |                                                |
| `showOutsideDays` | `boolean`                           | `true`      | 이전/다음 달 날짜 표시                         |
| `className`       | `string`                            | —           |                                                |
| `classNames`      | `Partial<Record<slot, string>>`     | —           | 슬롯별 클래스 덮어쓰기                         |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/common/Calendar';

const [date, setDate] = useState<Date | undefined>(undefined);

<Calendar mode="single" selected={date} onSelect={setDate} />;
```

---

## Chip

토글 가능한 알약(pill) 모양 버튼. 선택 상태를 색으로만 구분합니다.

### Props

| prop        | type                                     | default       | 설명                                                                       |
| ----------- | ---------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `label`     | `string`                                 | —             | 표시 텍스트 (필수)                                                         |
| `state`     | `'unchecked' \| 'checked' \| 'disabled'` | `'unchecked'` | 시각적 상태                                                                |
| `hash`      | `boolean`                                | `false`       | 해시태그 용도일 때만 `true`. `#` 아이콘이 라벨 색과 같은 색으로 표시됩니다 |
| `onClick`   | `() => void`                             | —             | 클릭 시 호출                                                               |
| `className` | `string`                                 | —             |                                                                            |
| …           | `Toggle` primitive attrs                 | —             | `pressed` 등은 내부 제어이므로 제외                                        |

`disabled`는 별도 boolean prop이 아니라 `state="disabled"`로 표현합니다.

`hash`는 프로젝트 분야·관심 분야 같은 해시태그 칩에만 켭니다. 직군 선택처럼 일반 선택지에는 기본값(`false`)을 그대로 둡니다. 해시태그로 쓰는 칩은 `Chip`을 직접 쓰지 말고 `Tag`를 쓰면 자동으로 켜집니다.

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { Chip } from '@/components/common/Chip';

const [checked, setChecked] = useState(false);

// 기본
<Chip label="칩" state={checked ? 'checked' : 'unchecked'} onClick={() => setChecked((v) => !v)} />

// 비활성
<Chip label="칩" state="disabled" />
```

---

## Input

아이콘을 옵션으로 붙일 수 있는 텍스트 입력.

### Props

| prop        | type                                  | default     | 설명                                                                                |
| ----------- | ------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `state`     | `'default' \| 'error' \| 'completed'` | `'default'` | 테두리 색으로 상태 표시                                                             |
| `size`      | `'small' \| 'medium' \| 'large'`      | `'medium'`  |                                                                                     |
| `icon`      | `ReactNode`                           | —           | 오른쪽 안쪽 아이콘                                                                  |
| `disabled`  | `boolean`                             | `false`     |                                                                                     |
| `className` | `string`                              | —           |                                                                                     |
| …           | `input` attrs                         | —           | `value`, `onChange` 등 (단, `size`는 variant 전용이라 HTML `size` 속성으로는 못 씀) |

### 사용 예

```tsx
import { Input } from '@/components/common/Input';

// 기본
<Input placeholder="입력하세요" />

// 상태 / 크기
<Input state="error" size="small" placeholder="에러" />
<Input state="completed" placeholder="완료" />

// 아이콘
<Input icon={<img src="/icons/search.svg" alt="" aria-hidden />} placeholder="검색" />

// disabled
<Input disabled placeholder="비활성" />
```

---

## Tag

`Chip`을 감싸 선택형 태그로 쓰는 컴포넌트. `value` 기준으로 선택 상태를 관리하고, `Chip`의 `hash`를 항상 켜서 라벨 앞에 `#` 아이콘을 붙입니다.

### Props

| prop       | type                      | default | 설명                       |
| ---------- | ------------------------- | ------- | -------------------------- |
| `value`    | `string`                  | —       | 항목 값 (필수)             |
| `label`    | `string`                  | —       | 표시 텍스트 (필수)         |
| `selected` | `boolean`                 | `false` |                            |
| `disabled` | `boolean`                 | `false` |                            |
| `onClick`  | `(value: string) => void` | —       | 클릭한 항목의 `value` 전달 |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { Tag } from '@/components/common/Tag';

const tags = [
  { value: 'a', label: '태그 A' },
  { value: 'b', label: '태그 B' },
];
const [selected, setSelected] = useState<string[]>([]);

const toggle = (value: string) =>
  setSelected((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );

<div className="flex gap-2">
  {tags.map((tag) => (
    <Tag
      key={tag.value}
      value={tag.value}
      label={tag.label}
      selected={selected.includes(tag.value)}
      onClick={toggle}
    />
  ))}
</div>;
```

---

## Toggle

ON/OFF 텍스트가 함께 표시되는 스위치. 제어 컴포넌트이므로 `checked`는 필수입니다.

### Props

| prop              | type                         | default | 설명           |
| ----------------- | ---------------------------- | ------- | -------------- |
| `checked`         | `boolean`                    | —       | 제어 값 (필수) |
| `onCheckedChange` | `(checked: boolean) => void` | —       |                |
| `disabled`        | `boolean`                    | `false` |                |
| `label`           | `string`                     | —       | 오른쪽 라벨    |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { Toggle } from '@/components/common/Toggle';

const [checked, setChecked] = useState(false);

<Toggle checked={checked} onCheckedChange={setChecked} label="알림 받기" />

// disabled
<Toggle checked={false} disabled />
```

---

## Textarea

여러 줄 텍스트 입력. 스타일은 `Input`과 같은 `inputVariants`를 씁니다. 높이만 내용에 맞게 늘어나며(`min-h-27`), 사용자 리사이즈는 막아 두었습니다(`resize-none`).

### Props

| prop        | type                                  | default     | 설명                                                                   |
| ----------- | ------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `state`     | `'default' \| 'error' \| 'completed'` | `'default'` | 테두리 색으로 상태 표시                                                |
| `size`      | `'small' \| 'medium' \| 'large'`      | `'medium'`  | 패딩·글자 크기만 적용 (높이는 `min-h-27`로 고정, `className`으로 변경) |
| `disabled`  | `boolean`                             | `false`     |                                                                        |
| `className` | `string`                              | —           |                                                                        |
| …           | `textarea` attrs                      | —           | `value`, `onChange`, `rows` 등                                         |

### 사용 예

```tsx
import { Textarea } from '@/components/common/Textarea';

<Textarea placeholder="내용을 입력하세요" />

// 상태
<Textarea state="error" placeholder="에러" />
```

---

## FileUpload

파일을 드래그하거나 클릭해서 고르는 점선 영역. 안쪽에 투명한 `<input type="file">`이 영역 전체를 덮고 있어 클릭으로 선택할 수 있고, 드롭은 직접 처리합니다(드래그 중 테두리 강조, 드롭한 파일을 input에 넣고 `change`를 발생시켜 클릭 선택과 같은 `onChange`로 받음. `multiple`이 아니면 첫 파일만). 선택된 파일 표시·형식/용량 검사는 이 컴포넌트가 하지 않고, 사용하는 쪽에서 `onChange`로 처리한 뒤 결과를 `FileUploadItem`으로 보여줍니다.

### Props

| prop                 | type                   | default            | 설명                                                 |
| -------------------- | ---------------------- | ------------------ | ---------------------------------------------------- |
| `title`              | `ReactNode`            | —                  | 안내 문구 (필수)                                     |
| `description`        | `ReactNode`            | —                  | 제목 아래 보조 문구 (지원 형식·용량 등)              |
| `icon`               | `ReactNode`            | 업로드 구름 아이콘 | 상단 아이콘                                          |
| `state`              | `'default' \| 'error'` | `'default'`        | `error`면 점선 테두리가 빨간색                       |
| `accept`             | `string`               | —                  | 허용 형식. 예: `image/png,image/jpeg`                |
| `multiple`           | `boolean`              | `false`            |                                                      |
| `disabled`           | `boolean`              | `false`            |                                                      |
| `containerClassName` | `string`               | —                  | 점선 영역(바깥 `label`) 클래스                       |
| `className`          | `string`               | —                  | 안쪽 `input` 클래스                                  |
| …                    | `input` attrs          | —                  | `id`, `name`, `onChange` 등 (`type`은 `file`로 고정) |

### 사용 예

```tsx
import { FileUpload } from '@/components/common/FileUpload';

<FileUpload
  id="project-image"
  name="image"
  accept="image/png,image/jpeg"
  title="파일을 이곳으로 드래그하거나 클릭하여 업로드하세요"
  description="PNG, JPG 형식 지원 · 파일당 최대 5MB (최대 1개)"
/>;
```

---

## FileUploadItem

`FileUpload`로 고른 파일 한 개를 보여주는 행. 형식·용량 위반처럼 파일 자체가 잘못됐을 때는 `state="error"`와 `errorMessage`로 행 안에 바로 안내합니다. 필수값이 비어 있는 것 같은 필드 단위 에러는 `FileUpload`의 `state`(점선 테두리)만으로 표시합니다.

### Props

| prop           | type                   | default     | 설명                                    |
| -------------- | ---------------------- | ----------- | --------------------------------------- |
| `label`        | `ReactNode`            | —           | 파일명 등 표시할 내용 (필수)            |
| `state`        | `'default' \| 'error'` | `'default'` | 테두리 색과 안내 문구 표시 여부         |
| `errorMessage` | `ReactNode`            | —           | `state="error"`일 때만 구분선 아래 표시 |
| `onRemove`     | `() => void`           | —           | 삭제 버튼 클릭 시 호출                  |
| `className`    | `string`               | —           |                                         |

### 사용 예

```tsx
import { FileUploadItem } from '@/components/common/FileUpload';

// 정상 선택
<FileUploadItem label="AI-Biz_Logo.png [PNG, 4MB]" onRemove={() => {}} />

// 에러
<FileUploadItem
  label="AI-Biz_Logo.png [PNG, 24MB]"
  state="error"
  errorMessage={
    <>
      등록 가능한 파일 용량을 초과했어요.
      <br />
      이미지는 파일당 최대 5MB까지 등록할 수 있어요.
    </>
  }
  onRemove={() => {}}
/>;
```

---

## Pagination

페이지 번호와 이전/다음 버튼으로 구성된 페이지네이션입니다.

### Props

| prop           | type                     | default | 설명                       |
| -------------- | ------------------------ | ------- | -------------------------- |
| `page`         | `number`                 | —       | 현재 페이지 (필수)         |
| `totalPages`   | `number`                 | —       | 전체 페이지 수 (필수)      |
| `onPageChange` | `(page: number) => void` | —       | 페이지 변경 시 호출 (필수) |
| `className`    | `string`                 | —       | 추가 클래스                |

### 사용 예

```tsx
'use client';

import { useState } from 'react';
import { Pagination } from '@/components/common/Pagination';

const [page, setPage] = useState(1);
const totalPages = 5;

{
  resultCount > 0 && (
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  );
}
```

이전/다음 버튼은 각각 `page`가 1 이하, `totalPages` 이상일 때 자동으로 비활성화됩니다.

---

## 컴포넌트 목록

| 컴포넌트       | 상태 | 담당   |
| -------------- | ---- | ------ |
| Button         | ✅   | 이찬우 |
| Badge          | ✅   | 이찬우 |
| Tooltip        | ✅   | 이찬우 |
| Dropdown       | ✅   | 이찬우 |
| Sonner         | ✅   | 이찬우 |
| ToastLarge     | ✅   | 김지은 |
| Radio          | ✅   | 이찬우 |
| CheckBox       | ✅   | 김지은 |
| Dialog         | ✅   | 이찬우 |
| Calendar       | ✅   | 김지은 |
| Chip           | ✅   | 김지은 |
| Input          | ✅   | 김지은 |
| Tag            | ✅   | 김지은 |
| Toggle         | ✅   | 김지은 |
| Textarea       | ✅   | 김지은 |
| FileUpload     | ✅   | 김지은 |
| FileUploadItem | ✅   | 김지은 |
| Pagination     | ✅   | 김지은 |
