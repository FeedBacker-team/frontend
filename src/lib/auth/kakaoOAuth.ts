import 'client-only';

const KAKAO_OAUTH_STATE_KEY = 'feedbacker:kakao-oauth-state';
const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

function createKakaoOAuthState() {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

function storeKakaoOAuthState(state: string) {
  window.sessionStorage.setItem(KAKAO_OAUTH_STATE_KEY, state);
}

function getKakaoRedirectUri() {
  return `${window.location.origin}/oauth/kakao/callback`;
}

function createKakaoAuthorizationUrl() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

  if (!clientId) {
    throw new Error('Kakao REST API key is required');
  }

  const state = createKakaoOAuthState();
  const redirectUri = getKakaoRedirectUri();
  const authorizeUrl = new URL(KAKAO_AUTHORIZE_URL);

  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('state', state);

  storeKakaoOAuthState(state);

  return authorizeUrl.toString();
}

function getStoredKakaoOAuthState() {
  try {
    return window.sessionStorage.getItem(KAKAO_OAUTH_STATE_KEY);
  } catch {
    return null;
  }
}

function clearStoredKakaoOAuthState() {
  try {
    window.sessionStorage.removeItem(KAKAO_OAUTH_STATE_KEY);
  } catch {
    // 브라우저에서 sessionStorage 사용이 제한된 경우
  }
}

export {
  clearStoredKakaoOAuthState,
  createKakaoAuthorizationUrl,
  getKakaoRedirectUri,
  getStoredKakaoOAuthState,
  KAKAO_OAUTH_STATE_KEY,
};
