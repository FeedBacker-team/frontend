import { PROFILE_JOBS } from '@/constants/profile';

import { userRequest } from './request';

const PROFILE_PATH = '/api/users/me/profile';

type ProfileRole = (typeof PROFILE_JOBS)[number]['value'];
type ProfileInterest = string;

type ProfileResponse = {
  user_id: string;
  profile_image_url: string | null;
  nickname: string;
  role: ProfileRole;
  intro_link: string | null;
  interests: ProfileInterest[];
  is_profile_completed: boolean;
};

type GetProfileResponse = ProfileResponse & {
  acorn: number;
  humidity: number;
};

type UpdateProfileRequest = {
  profile_image_path?: string;
  nickname: string;
  role: ProfileRole;
  intro_link?: string;
  interests?: ProfileInterest[];
};

type UpdateProfileResponse = ProfileResponse;

function getMockProfileResponse(): GetProfileResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    profile_image_url: null,
    nickname: '닉네임',
    role: 'DEVELOPER',
    intro_link: null,
    interests: ['WEB'],
    is_profile_completed: true,
    acorn: 60,
    humidity: 100,
  };
}

function getMockUpdateProfileResponse(
  body: UpdateProfileRequest
): UpdateProfileResponse {
  return {
    user_id: '00000000-0000-4000-8000-000000000001',
    profile_image_url: body.profile_image_path
      ? `https://example.com/${body.profile_image_path}`
      : null,
    nickname: body.nickname,
    role: body.role,
    intro_link: body.intro_link || null,
    interests: body.interests ?? [],
    is_profile_completed: true,
  };
}

async function getProfile(): Promise<GetProfileResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockProfileResponse();
  }

  return userRequest<GetProfileResponse>(PROFILE_PATH, {
    method: 'GET',
    fallbackMessage: '프로필 조회에 실패했습니다',
  });
}

async function updateProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getMockUpdateProfileResponse(body);
  }

  return userRequest<UpdateProfileResponse>(PROFILE_PATH, {
    method: 'PATCH',
    json: body,
    fallbackMessage: '프로필 저장에 실패했습니다',
  });
}

export { getProfile, updateProfile };
export type {
  GetProfileResponse,
  ProfileInterest,
  ProfileResponse,
  ProfileRole,
  UpdateProfileRequest,
  UpdateProfileResponse,
};
