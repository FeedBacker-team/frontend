import {
  ProfileError,
  type CheckNicknameResponse,
  type ProfileErrorResponse,
  type UpdateProfileRequest,
  type UpdateProfileResponse,
} from '@/types/profile';

const PROFILE_PATHS = {
  me: '/api/users/me/profile',
  checkNickname: '/api/users/check-nickname',
} as const;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockUpdateProfileResponse(
  body: UpdateProfileRequest
): UpdateProfileResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    profile_image_url: body.profile_image_url ?? null,
    nickname: body.nickname,
    role: body.role,
    intro_link: body.intro_link || null,
    interests: body.interests ?? [],
  };
}

async function parseProfileError(response: Response, fallbackMessage: string) {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as ProfileErrorResponse).message === 'string'
    ) {
      return (data as ProfileErrorResponse).message as string;
    }
  } catch {
    // 에러 body가 JSON이 아닌 경우
  }

  return fallbackMessage;
}

async function checkNickname(nickname: string): Promise<CheckNicknameResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);

    if (nickname === 'taken') {
      throw new ProfileError('이미 사용 중인 닉네임입니다.', 409);
    }

    return {
      is_available: true,
      message: '사용 가능한 닉네임입니다.',
    };
  }

  const query = new URLSearchParams({ nickname });
  const response = await fetch(
    `${apiBaseUrl}${PROFILE_PATHS.checkNickname}?${query}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new ProfileError(
      await parseProfileError(
        response,
        response.status === 409
          ? '이미 사용 중인 닉네임입니다.'
          : '닉네임 중복 확인에 실패했습니다'
      ),
      response.status
    );
  }

  const data: CheckNicknameResponse = await response.json();

  if (!data.is_available) {
    throw new ProfileError(
      data.message || '이미 사용 중인 닉네임입니다.',
      409
    );
  }

  return data;
}

async function updateProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    await delay(400);
    return getMockUpdateProfileResponse(body);
  }

  const response = await fetch(`${apiBaseUrl}${PROFILE_PATHS.me}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ProfileError(
      await parseProfileError(response, '프로필 저장에 실패했습니다'),
      response.status
    );
  }

  return response.json();
}

export { checkNickname, updateProfile };
