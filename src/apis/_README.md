# API 모듈 사용 가이드

`src/apis`는 백엔드 API의 요청·응답 타입과 통신 함수를 관리합니다.
컴포넌트가 직접 `fetch`를 호출하지 않도록 아래 흐름을 기준으로 사용합니다.

```text
컴포넌트 → React Query Hook → API 함수 → 공통 Client → 백엔드
```

## 폴더 구조

```text
src/apis/
├── baseClient.ts       # 공통 fetch, 쿠키, JSON 및 오류 응답 처리
├── client.ts           # Access Token 첨부, 401 재발급 및 요청 재시도
├── auth/               # 회원가입, 로그인, 로그아웃, 토큰 재발급
├── users/              # 사용자 프로필 및 닉네임 확인
├── images/             # 이미지 업로드
└── tags/               # 관심 분야 태그 조회
```

기존의 `file.ts`, `project.ts`, `qa.ts`도 각 도메인의 API를 담당합니다. API가
늘어나면 같은 기준으로 도메인 폴더로 분리합니다.

## 공통 Client의 역할

### `baseClient.ts`

가장 낮은 단계의 HTTP 요청 함수입니다.

- `NEXT_PUBLIC_API_URL`과 API 경로 결합
- 기본 `credentials: 'include'` 적용
- JSON 요청의 `Content-Type`과 body 직렬화
- JSON/void 응답 처리
- 백엔드의 `message`를 읽어 공통 오류 생성

로그인 전 요청이나 공개 API처럼 Access Token이 필요 없는 경우에만 직접
사용하거나, 도메인 전용 요청 함수로 감싸서 사용합니다.

### `client.ts`

인증이 필요한 API에서 사용하는 Client입니다.

- 메모리의 Access Token을 `Authorization: Bearer` 헤더에 첨부
- 401 응답 시 Refresh Token 쿠키로 Access Token 재발급
- 재발급 성공 시 실패했던 요청을 한 번 재시도
- 여러 요청이 동시에 401을 받아도 중복 재발급을 방지

컴포넌트에서 토큰을 읽거나 Refresh API를 직접 호출하지 않습니다.

## Client 선택 기준

| 요청 종류                | 사용할 함수                               | 예시                                      |
| ------------------------ | ----------------------------------------- | ----------------------------------------- |
| 로그인 전 또는 공개 요청 | `baseApiRequest` 또는 도메인 전용 wrapper | 로그인, 회원가입, 이메일 인증, 태그 조회  |
| 로그인 후 인증 요청      | `apiRequest` 또는 도메인 전용 wrapper     | 프로필 조회·수정, 이미지 업로드, 로그아웃 |

`fetch`를 직접 호출하면 쿠키, 오류 처리, 토큰 재발급 동작이 누락될 수 있으므로
API 모듈 밖에서는 직접 호출하지 않습니다.

## 파일 작성 규칙

1. 백엔드 Controller 또는 기능 단위로 폴더를 구분합니다.
2. 기본적으로 하나의 API 기능을 하나의 파일에서 관리합니다.
3. 같은 리소스의 메서드가 여러 개인 경우 한 파일에서 관리할 수 있습니다.

- 예: `users/profile.ts`에서 `GET`, `PATCH /api/users/me/profile` 관리

4. 요청·응답 타입은 해당 API 함수와 같은 파일에 둡니다.
5. 외부에서 사용할 함수와 타입만 `index.ts`에서 export 합니다.
6. 도메인별 오류 처리가 필요하면 `error.ts`, `request.ts`를 둡니다.
7. 컴포넌트에서는 가능하면 `src/hooks`의 React Query Hook을 사용합니다.

## 새로운 API 추가 예시

예를 들어 인증이 필요한 사용자 API를 추가한다면 다음 순서로 작성합니다.

```ts
// src/apis/users/example.ts
import { userRequest } from './request';

const EXAMPLE_PATH = '/api/users/example';

type ExampleResponse = {
  value: string;
};

function getExample() {
  return userRequest<ExampleResponse>(EXAMPLE_PATH, {
    method: 'GET',
    fallbackMessage: '정보를 불러오지 못했습니다',
  });
}

export { getExample };
export type { ExampleResponse };
```

그다음 `users/index.ts`에서 공개하고, 서버 상태가 필요한 화면에서는 React Query
Hook으로 감싸서 사용합니다.

## 인증 정보와 쿠키

- Access Token은 `tokenManager`의 메모리에만 저장합니다.
- Access Token을 `localStorage`, `sessionStorage` 또는 일반 쿠키에 저장하지 않습니다.
- Refresh Token은 서버가 HttpOnly 쿠키로 관리하므로 프론트에서 읽지 않습니다.
- 모든 백엔드 요청은 Refresh Token 쿠키를 주고받을 수 있도록
  `credentials: 'include'`를 사용합니다.
- 새로고침으로 Access Token이 사라지면 앱 초기화 과정에서 Refresh API로 세션을
  복구합니다.

## 환경 변수

팀에서 사용하는 환경 변수 이름은 `.env.example`에 공유하고, 실제 값은 Git에
올리지 않는 `.env.local`에 작성합니다.

```dotenv
NEXT_PUBLIC_API_URL=https://example-api.com
NEXT_PUBLIC_KAKAO_REST_API_KEY=example-key
```

환경 변수를 변경한 뒤에는 개발 서버를 다시 실행해야 합니다.

> 일부 인증·프로필 API에는 퍼블리싱 확인용 mock 응답이 있습니다.
> `NEXT_PUBLIC_API_URL`이 없으면 화면은 동작하는 것처럼 보여도 Network 요청이
> 발생하지 않을 수 있으므로 실제 연동 테스트 전에 환경 변수를 확인합니다.

정확한 필드와 응답 형식의 기준은 백엔드 Swagger이며, 이 문서는 프론트엔드에서
API 모듈을 구성하고 사용하는 방법을 설명합니다.
