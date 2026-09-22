'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { KakaoLoginButton } from '@/components/domain/auth/KakaoLoginButton';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-h4 text-text-default">
            이메일
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-border-default px-4"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-h4 text-text-default">
            비밀번호
          </label>
          <Input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border-border-default px-4"
            icon={
              <button
                type="button"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex size-6 cursor-pointer items-center justify-center"
              >
                <Image
                  src={
                    showPassword
                      ? '/icons/visibility_off.svg'
                      : '/icons/visibility.svg'
                  }
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                  unoptimized
                />
              </button>
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Button
          type="submit"
          variant="secondary"
          size="large"
          className="w-full"
        >
          로그인
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-divider-default" />
          <span className="text-c1 text-text-info">또는</span>
          <span className="h-px flex-1 bg-divider-default" />
        </div>
        <KakaoLoginButton />
        <div className="flex items-center justify-center">
          <Link
            href="/signup"
            className="flex-1 text-c1 text-center text-rust-600"
          >
            회원가입
          </Link>
          <span className="h-4 w-px bg-divider-default" />
          <Link href="#" className="flex-1 text-c1 text-center text-text-sub">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </form>
  );
}

export { LoginForm };
