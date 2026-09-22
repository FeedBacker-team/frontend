'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { KakaoLoginButton } from '@/components/domain/auth/KakaoLoginButton';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { cn } from '@/lib/utils';
import { AuthError } from '@/types/auth';

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1 text-c2 text-system-alert"
    >
      <span
        aria-hidden
        className="block size-5 shrink-0 bg-system-alert mask-(--field-error-icon) mask-center mask-contain mask-no-repeat"
        style={
          {
            '--field-error-icon': 'url(/icons/alert-circle.svg)',
          } as CSSProperties
        }
      />
      {message}
    </p>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onError: (error) => {
        const message =
          error instanceof AuthError
            ? error.message
            : '로그인에 실패했습니다';

        setError('password', { message });
      },
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-h4 text-text-default">
            이메일
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            state={errors.email ? 'error' : 'default'}
            className={cn('px-4', !errors.email && 'border-border-default')}
            {...register('email')}
          />
          {errors.email?.message ? (
            <FieldError id="login-email-error" message={errors.email.message} />
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-h4 text-text-default">
            비밀번호
          </label>
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'login-password-error' : undefined
            }
            state={errors.password ? 'error' : 'default'}
            className={cn('px-4', !errors.password && 'border-border-default')}
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
            {...register('password')}
          />
          {errors.password?.message ? (
            <FieldError
              id="login-password-error"
              message={errors.password.message}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Button
          type="submit"
          variant="secondary"
          size="large"
          className="w-full"
          disabled={isPending}
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
