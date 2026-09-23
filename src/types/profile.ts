import { PROFILE_INTEREST_TAGS, PROFILE_JOBS } from '@/constants/profile';

type ProfileRole = (typeof PROFILE_JOBS)[number]['value'];
type ProfileInterest = (typeof PROFILE_INTEREST_TAGS)[number]['value'];

type UpdateProfileRequest = {
  profile_image_url?: string;
  nickname: string;
  role: ProfileRole;
  intro_link?: string;
  interests?: ProfileInterest[];
};

type UpdateProfileResponse = {
  user_id: string;
  profile_image_url: string | null;
  nickname: string;
  role: ProfileRole;
  intro_link: string | null;
  interests: ProfileInterest[];
};

type CheckNicknameResponse = {
  is_available: boolean;
  message: string;
};

type ProfileErrorResponse = {
  message?: string;
};

class ProfileError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ProfileError';
    this.status = status;
  }
}

export { ProfileError };
export type {
  CheckNicknameResponse,
  ProfileErrorResponse,
  ProfileInterest,
  ProfileRole,
  UpdateProfileRequest,
  UpdateProfileResponse,
};
