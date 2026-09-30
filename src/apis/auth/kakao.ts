import { postAuth } from './request';

const KAKAO_LOGIN_PATH = '/api/auth/kakao';

type KakaoLoginRequest = {
  authorization_code: string;
};

type KakaoLoginResponse = {
  user_id: string;
  email: string | null;
  access_token: string;
  expires_in: number;
  is_new_user: boolean;
  is_profile_completed: boolean;
};

function loginWithKakao(body: KakaoLoginRequest) {
  return postAuth<KakaoLoginResponse>(KAKAO_LOGIN_PATH, {
    body,
    fallbackMessage: '카카오 로그인에 실패했습니다',
  });
}

export { loginWithKakao };
export type { KakaoLoginRequest, KakaoLoginResponse };
