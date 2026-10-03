# Users API 사용 가이드

`src/apis/users`는 현재 사용자 프로필 조회·수정과 닉네임 중복 확인 API를
관리합니다.

## 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `profile.ts` | 내 프로필 조회와 수정 |
| `checkNickname.ts` | 닉네임 중복 확인 |
| `request.ts` | 인증 Client를 사용하는 Users 전용 요청 wrapper |
| `error.ts` | 상태 코드를 포함하는 `UserError` 정의 |
| `index.ts` | 외부에 공개할 함수와 타입 export |

## 프로필 조회와 수정

`GET /api/users/me/profile`과 `PATCH /api/users/me/profile`은 같은 프로필
리소스를 사용하므로 `profile.ts` 한 파일에서 관리합니다.

| 함수 | 메서드 | 역할 |
| --- | --- | --- |
| `getProfile` | GET | 로그인한 사용자의 프로필 조회 |
| `updateProfile` | PATCH | 프로필 작성 또는 수정 |

화면에서는 React Query Hook을 사용합니다.

```ts
const profile = useProfile();
const updateProfile = useUpdateProfile();
```

프로필 완성 화면처럼 인증 및 태그 정보를 먼저 확인해야 하는 화면은 필요한
정보가 준비된 뒤 Query와 폼을 활성화합니다.

## 닉네임 중복 확인

`checkNickname`은 Query Parameter로 닉네임을 전달합니다.

```text
GET /api/users/check-nickname?nickname=사용자닉네임
```

응답의 `is_available`이 `false`이면 `UserError`를 발생시켜 화면에서 중복 상태를
동일하게 처리합니다. 화면에서는 `useCheckNickname`을 사용합니다.

## 프로필 이미지 처리

프로필 이미지 업로드와 프로필 저장은 별도 요청입니다.

```text
파일 선택
→ 브라우저에서 로컬 미리보기 생성
→ 프로필 저장 버튼 클릭
→ 최종 선택된 파일만 POST /api/images
→ 응답으로 images/example.png 형태의 path 수신
→ PATCH /api/users/me/profile의 profile_image_path에 전달
```

- 파일을 선택하거나 교체하는 동안에는 Storage에 업로드하지 않습니다.
- 프로필 제출에 실패해 다시 시도할 때는 이미 업로드된 동일 파일의 path를
  재사용합니다.
- 수정 요청에는 완성된 URL이 아닌 `profile_image_path`를 전달합니다.
- 이미지를 선택하지 않으면 `profile_image_path`를 생략합니다.
- 조회 및 수정 응답에서는 서버가 완성한 `profile_image_url`을 반환합니다.
- `profile_image_url`이 `null`이면 `/icons/basic-avatars.svg`를 표시합니다.

```ts
const imagePaths = await uploadImages([file]);

await updateProfile({
  profile_image_path: imagePaths[0],
  nickname,
  role,
  interests,
});
```

## 직군 처리

화면에는 한글 label을 표시하고 API에는 enum value를 전달합니다. 직군 목록과
타입 기준은 `src/constants/profile.ts`의 `PROFILE_JOBS`입니다.

```text
개발자      → DEVELOPER
디자이너    → DESIGNER
기획자      → PLANNER
1인 개발자  → SOLO_DEV
기타        → OTHER
```

## 관심 분야 처리

관심 분야를 프론트에서 임의로 정의하지 않고 `GET /api/tags` 결과를 사용합니다.

```json
{
  "code": "WEB",
  "displayName": "웹"
}
```

- 화면의 버튼에는 `displayName`을 표시합니다.
- 프로필 요청의 `interests`에는 선택된 항목의 `code`를 전달합니다.
- `APP`, `WEB`, `UXUI`처럼 Swagger에 정의된 정확한 코드를 사용합니다.

```ts
await updateProfile({
  nickname,
  role,
  interests: selectedTags.map((tag) => tag.code),
});
```

## 프로필 완성 여부

회원가입 직후에는 `is_profile_completed`가 `false`일 수 있습니다. 필수 프로필
정보 저장에 성공하고 응답이 `true`가 되면 `completeAuthProfile`로 인증 상태에도
완료 여부를 반영합니다.

프로필이 완성되지 않은 사용자는 프로젝트 등록 등 제한된 기능으로 이동하지
않도록 Route 또는 화면 진입 단계에서 차단합니다.

## 오류 처리

Users API는 `userRequest`를 통해 공통 인증 Client를 사용하고 오류를
`UserError`로 변환합니다.

```ts
if (error instanceof UserError) {
  console.log(error.status, error.message);
}
```

프로필 요청에서 401이 발생하면 공통 Client가 Access Token 재발급 후 한 번
재시도하므로, 화면에서 Refresh API를 별도로 호출하지 않습니다.

## 관련 파일

- `src/hooks/useProfile.ts`: 프로필 및 닉네임 React Query Hook
- `src/hooks/useImages.ts`: 이미지 업로드 mutation Hook
- `src/hooks/useTags.ts`: 관심 분야 목록 Query Hook
- `src/components/domain/shared/ProfileForm.tsx`: 프로필 입력 공통 폼
- `src/constants/profile.ts`: 직군 value와 label
