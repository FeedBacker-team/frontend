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

async function getProfile(): Promise<GetProfileResponse> {
  return userRequest<GetProfileResponse>(PROFILE_PATH, {
    method: 'GET',
    fallbackMessage: '프로필 조회에 실패했습니다',
  });
}

async function updateProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
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
