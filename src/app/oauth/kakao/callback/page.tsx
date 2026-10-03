import type { Metadata } from 'next';

import { KakaoCallback } from '@/components/domain/auth/KakaoCallback';

export const metadata: Metadata = {
  title: '카카오 로그인',
};

type KakaoCallbackPageProps = {
  searchParams: Promise<{
    code?: string | string[];
    state?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
  }>;
};

function getFirst(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function KakaoCallbackPage({
  searchParams,
}: KakaoCallbackPageProps) {
  const params = await searchParams;

  return (
    <KakaoCallback
      authorizationCode={getFirst(params.code)}
      state={getFirst(params.state)}
      oauthError={getFirst(params.error)}
      oauthErrorDescription={getFirst(params.error_description)}
    />
  );
}
