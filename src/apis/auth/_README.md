# Auth API 사용 가이드

`src/apis/auth`는 이메일 회원가입, 로그인, 로그아웃, Access Token 재발급 및
카카오 로그인을 관리합니다.

## 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `requestEmailVerification.ts` | 이메일 인증번호 발송 |
| `verifyEmail.ts` | 이메일과 인증번호 검증 |
| `signup.ts` | 이메일과 비밀번호로 회원가입 |
| `login.ts` | 이메일과 비밀번호로 로그인 |
| `refresh.ts` | Refresh Token 쿠키로 Access Token 재발급 |
| `logout.ts` | 서버 로그아웃 처리 |
| `kakao.ts` | 카카오 인가 코드를 백엔드에 전달 |
| `request.ts` | 인증 전용 POST 요청 wrapper |
| `error.ts` | 상태 코드를 포함하는 `AuthError` 정의 |
| `index.ts` | 외부에 공개할 함수와 타입 export |

## 인증 정보 관리

- 백엔드는 로그인·회원가입·카카오 로그인 응답 body로 Access Token을 반환합니다.
- 프론트는 `establishAuthSession`을 통해 Access Token을 메모리에 저장합니다.
- Refresh Token은 백엔드가 HttpOnly 쿠키로 발급하고 관리합니다.
- Zustand에는 토큰이 아니라 인증 상태와 프로필 완성 여부만 저장합니다.
- Access Token과 Refresh Token을 콘솔에 출력하지 않습니다.

```ts
establishAuthSession({
  accessToken: response.access_token,
  isProfileCompleted: response.is_profile_completed,
});
```

## 이메일 회원가입 흐름

```text
인증번호 요청
→ 인증번호 검증
→ 회원가입
→ Access Token 메모리 저장
→ is_profile_completed 확인
→ 프로필 미완성 사용자는 프로필 완성 화면으로 이동
```

화면에서는 `src/hooks/useAuth.ts`의 Hook을 사용합니다.

```ts
const sendEmailVerification = useSendEmailVerification();
const verifyEmailCode = useVerifyEmailCode();
const signup = useSignup();
```

인증번호 유효 시간이 만료되면 검증을 막고 인증번호를 다시 요청하게 합니다.

## 이메일 로그인 흐름

```text
로그인 요청
→ Access Token 메모리 저장
→ is_profile_completed 확인
→ 완료 여부에 따라 메인 또는 프로필 완성 화면으로 이동
```

```ts
const login = useLogin();
```

로그인과 회원가입 응답을 받은 컴포넌트는 토큰을 직접 보관하지 않고
`establishAuthSession`에 전달합니다.

## 새로고침과 401 처리

브라우저를 새로고침하면 메모리에 있던 Access Token은 사라집니다.
`AuthInitializer`가 Refresh Token 쿠키를 이용해 세션 복구를 시도합니다.

인증된 API 요청 중 Access Token이 만료되어 401이 발생하면 `apiRequest`가 다음
순서로 처리합니다.

1. `refreshAuthSession`을 호출합니다.
2. 새 Access Token을 메모리에 저장합니다.
3. 실패했던 API 요청을 한 번 다시 보냅니다.
4. 재발급도 실패하면 인증 상태를 초기화합니다.

동시 요청에서 여러 401이 발생해도 하나의 Refresh 요청을 공유합니다. 따라서
컴포넌트나 각 API 파일에서 Refresh API를 직접 호출하지 않습니다.

## 로그아웃 흐름

```text
로그아웃 API 호출
→ 서버가 Refresh Token 쿠키 제거
→ 프론트가 Access Token 및 인증 상태 제거
```

로그아웃은 인증이 필요한 요청이므로 `logout.ts`에서 `apiRequest`를 사용합니다.
화면에서는 `useLogout`을 사용하고, 성공 후 `clearAuthSession`으로 메모리 상태를
정리합니다.

## 카카오 로그인 흐름

```text
카카오 로그인 버튼 클릭
→ 카카오 인증 페이지로 이동
→ /oauth/kakao/callback에서 code와 state 확인
→ authorization_code를 POST /api/auth/kakao로 전달
→ Access Token 메모리 저장
→ 신규 사용자 및 프로필 완성 여부에 따라 이동
```

- 인가 코드는 한 번만 사용할 수 있으므로 동일한 code로 API를 두 번 호출하지
  않습니다.
- 카카오 인가 요청과 백엔드 토큰 요청의 Redirect URI가 정확히 일치해야 합니다.
- 카카오 사용자의 `email`은 `null`일 수 있으므로 필수 문자열로 가정하지 않습니다.
- 현재 API 요청 타입은 `authorization_code`만 전달합니다. 백엔드 명세에
  `redirect_uri`가 추가되면 요청 타입과 콜백 호출부를 함께 수정합니다.

## `postAuth`와 `apiRequest`의 차이

로그인, 회원가입, 이메일 인증, Refresh, 카카오 로그인은 Access Token 없이
호출되어야 하므로 `postAuth`를 사용합니다. `postAuth`는 `baseApiRequest`를 감싸고
오류를 `AuthError`로 변환합니다.

로그아웃처럼 이미 로그인한 사용자의 요청은 `apiRequest`를 사용합니다.

## 자주 발생하는 문제

### 버튼과 타이머는 동작하지만 Network 요청이 없는 경우

`NEXT_PUBLIC_API_URL`이 설정됐는지 확인하고 개발 서버를 다시 실행합니다. 일부
Auth 함수는 환경 변수가 없을 때 퍼블리싱용 mock 응답을 반환합니다.

### Refresh 요청이 401인 경우

- 요청에 `credentials: 'include'`가 적용됐는지 확인합니다.
- 브라우저에 Refresh Token 쿠키가 발급됐는지 확인합니다.
- 백엔드 CORS의 Origin과 credentials 설정을 확인합니다.

### 카카오 로그인이 401인 경우

- 인가 코드를 이미 사용했는지 확인합니다.
- Network 탭에서 `/api/auth/kakao`가 두 번 호출됐는지 확인합니다.
- 인가 요청과 백엔드 설정의 Redirect URI가 일치하는지 확인합니다.

## 관련 파일

- `src/hooks/useAuth.ts`: React Query mutation Hook
- `src/lib/auth/tokenManager.ts`: Access Token 메모리 관리
- `src/lib/auth/session.ts`: 토큰과 Zustand 인증 상태 동기화
- `src/lib/auth/refreshSession.ts`: Refresh 요청 중복 방지 및 세션 갱신
- `src/stores/authStore.ts`: 인증 상태와 프로필 완성 여부 관리
- `src/components/domain/auth/AuthInitializer.tsx`: 새로고침 후 세션 복구
