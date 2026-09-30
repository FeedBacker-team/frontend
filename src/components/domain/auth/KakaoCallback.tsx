'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthError } from '@/apis/auth';
import { Button } from '@/components/common/Button';
import { useKakaoLogin } from '@/hooks/useAuth';
import {
  clearStoredKakaoOAuthState,
  getStoredKakaoOAuthState,
} from '@/lib/auth/kakaoOAuth';
import { establishAuthSession } from '@/lib/auth/session';

type KakaoCallbackProps = {
  authorizationCode?: string;
  state?: string;
  oauthError?: string;
  oauthErrorDescription?: string;
};

function getInitialError({
  authorizationCode,
  oauthError,
  oauthErrorDescription,
}: KakaoCallbackProps) {
  if (oauthError) {
    return (
      oauthErrorDescription ??
      (oauthError === 'access_denied'
        ? '카카오 로그인이 취소되었습니다.'
        : '카카오 인증을 완료하지 못했습니다.')
    );
  }

  if (!authorizationCode) {
    return '카카오 인가 코드를 확인할 수 없습니다.';
  }

  return null;
}

function KakaoCallback(props: KakaoCallbackProps) {
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const initialError = getInitialError(props);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate, error, isPending } = useKakaoLogin();

  useEffect(() => {
    if (hasStartedRef.current || validationError) {
      return;
    }

    if (initialError) {
      hasStartedRef.current = true;
      clearStoredKakaoOAuthState();
      return;
    }

    hasStartedRef.current = true;

    const storedState = getStoredKakaoOAuthState();

    if (!props.state || !storedState || props.state !== storedState) {
      hasStartedRef.current = false;
      clearStoredKakaoOAuthState();

      let isCancelled = false;
      queueMicrotask(() => {
        if (!isCancelled) {
          setValidationError(
            '카카오 로그인 요청을 확인할 수 없습니다. 로그인 페이지에서 다시 시도해 주세요.'
          );
        }
      });

      return () => {
        isCancelled = true;
      };
    }

    clearStoredKakaoOAuthState();

    mutate(
      { authorization_code: props.authorizationCode! },
      {
        onSuccess: (data) => {
          establishAuthSession({
            accessToken: data.access_token,
            isProfileCompleted: data.is_profile_completed,
          });
          router.replace(data.is_profile_completed ? '/' : '/profile');
        },
      }
    );
  }, [
    initialError,
    mutate,
    props.authorizationCode,
    props.state,
    router,
    validationError,
  ]);

  const requestError = error
    ? error instanceof AuthError
      ? error.message
      : '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    : null;
  const errorMessage = initialError ?? validationError ?? requestError;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-text-default">카카오 로그인</h1>
        <p
          role={errorMessage ? 'alert' : 'status'}
          className={
            errorMessage ? 'text-b2 text-system-alert' : 'text-b2 text-text-sub'
          }
        >
          {errorMessage ??
            (isPending
              ? '카카오 계정 정보를 확인하고 있어요.'
              : '카카오 로그인을 준비하고 있어요.')}
        </p>
      </div>

      {errorMessage ? (
        <Button
          type="button"
          variant="secondary"
          size="large"
          className="w-full"
          onClick={() => router.replace('/login')}
        >
          로그인으로 돌아가기
        </Button>
      ) : (
        <div
          aria-hidden
          className="mx-auto size-8 animate-spin rounded-full border-3 border-gray-200 border-t-rust-600"
        />
      )}

      <Link href="/" className="text-center text-c1 text-text-sub">
        홈으로 이동
      </Link>
    </div>
  );
}

export { KakaoCallback };
export type { KakaoCallbackProps };
