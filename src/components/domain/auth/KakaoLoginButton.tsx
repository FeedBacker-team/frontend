'use client';

import { useState } from 'react';

import { toast } from '@/components/common/Sonner';
import { createKakaoAuthorizationUrl } from '@/lib/auth/kakaoOAuth';

function KakaoLoginButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleKakaoLogin = () => {
    try {
      const authorizeUrl = createKakaoAuthorizationUrl();

      setIsRedirecting(true);
      window.location.assign(authorizeUrl);
    } catch {
      toast.error(
        '카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  return (
    <button
      type="button"
      disabled={isRedirecting}
      onClick={handleKakaoLogin}
      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#FEE500] text-h4 text-text-default disabled:pointer-events-none disabled:opacity-60"
    >
      {isRedirecting ? '카카오로 이동 중...' : '카카오로 계속하기'}
    </button>
  );
}

export { KakaoLoginButton };
