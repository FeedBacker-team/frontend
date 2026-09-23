'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  useSendEmailVerification,
  useSignup,
  useVerifyEmailCode,
} from '@/hooks/useAuth';
import { signupSchema, type SignupFormValues } from '@/lib/schemas/auth';
import { cn } from '@/lib/utils';
import { AuthError } from '@/types/auth';

function PasswordVisibilityButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
      onClick={onToggle}
      className="flex size-5 cursor-pointer items-center justify-center"
    >
      <Image
        src={visible ? '/icons/visibility_off.svg' : '/icons/visibility.svg'}
        alt=""
        aria-hidden
        width={20}
        height={20}
        unoptimized
      />
    </button>
  );
}

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

function FieldSuccess({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-center gap-1 text-c2 text-system-success">
      <span
        aria-hidden
        className="block size-5 shrink-0 bg-system-success mask-(--field-success-icon) mask-center mask-contain mask-no-repeat"
        style={
          {
            '--field-success-icon': 'url(/icons/check.svg)',
          } as CSSProperties
        }
      />
      {message}
    </p>
  );
}

function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof AuthError ? error.message : fallbackMessage;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function VerificationTimer({ remainingSeconds }: { remainingSeconds: number }) {
  return (
    <span aria-hidden className="text-h4 text-rust-600 tabular-nums">
      {formatCountdown(remainingSeconds)}
    </span>
  );
}

function SignupForm() {
  const [emailVerified, setEmailVerified] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { mutate: sendEmailCode, isPending: isSendingCode } =
    useSendEmailVerification();
  const { mutate: verifyCode, isPending: isVerifyingCode } =
    useVerifyEmailCode();
  const { mutate: signupAccount, isPending: isSigningUp } = useSignup();
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (emailVerified || remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((current) =>
        current === null ? current : current - 1
      );
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [emailVerified, remainingSeconds]);

  const onRequestCode = async () => {
    const emailOk = await trigger('email');
    if (!emailOk) {
      return;
    }

    sendEmailCode(
      { email: getValues('email') },
      {
        onSuccess: (data) => {
          clearErrors('email');
          setRemainingSeconds(data.expires_in);
        },
        onError: (error) => {
          setError('email', {
            message: getAuthErrorMessage(error, '인증번호 발송에 실패했습니다'),
          });
        },
      }
    );
  };

  const onConfirmCode = async () => {
    const emailOk = await trigger('email');
    if (!emailOk) {
      return;
    }

    const code = getValues('verificationCode').trim();
    if (!code) {
      setError('verificationCode', {
        message: '이메일 인증이 완료되지 않았습니다',
      });
      return;
    }

    verifyCode(
      { email: getValues('email'), code },
      {
        onSuccess: (data) => {
          if (!data.verified) {
            setError('verificationCode', {
              message: data.message || '이메일 인증이 완료되지 않았습니다',
            });
            return;
          }

          clearErrors(['verificationCode', 'email']);
          setRemainingSeconds(null);
          setEmailVerified(true);
        },
        onError: (error) => {
          setError('verificationCode', {
            message: getAuthErrorMessage(
              error,
              '이메일 인증이 완료되지 않았습니다'
            ),
          });
        },
      }
    );
  };

  const onSubmit = (values: SignupFormValues) => {
    if (!emailVerified) {
      setError('email', { message: '이메일 인증을 완료해주세요' });
      return;
    }

    signupAccount(
      { email: values.email, password: values.password },
      {
        onError: (error) => {
          setError('password', {
            message: getAuthErrorMessage(error, '회원가입에 실패했습니다'),
          });
        },
      }
    );
  };

  const emailState = emailVerified
    ? 'completed'
    : errors.email
      ? 'error'
      : 'default';
  const verificationState = emailVerified
    ? 'completed'
    : errors.verificationCode
      ? 'error'
      : 'default';
  const showVerificationTimer = remainingSeconds !== null && !emailVerified;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <h1 className="text-h1 text-text-default">회원가입</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-email"
              className="flex items-center gap-1 text-h4 text-text-default"
            >
              이메일
              <p className="text-h4 text-system-error text-system-alert">*</p>
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  readOnly={emailVerified}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? 'signup-email-error' : undefined
                  }
                  state={emailState}
                  className={cn(
                    'h-12 px-4',
                    emailState === 'default' && 'border-border-default'
                  )}
                  {...register('email')}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="large"
                className="h-12 w-21.5 shrink-0 px-5"
                disabled={emailVerified || isSendingCode}
                onClick={onRequestCode}
              >
                인증 요청
              </Button>
            </div>
            {errors.email?.message ? (
              <FieldError
                id="signup-email-error"
                message={errors.email.message}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  id="signup-verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="인증번호를 입력해 주세요"
                  readOnly={emailVerified}
                  aria-invalid={!!errors.verificationCode}
                  aria-describedby={
                    emailVerified
                      ? 'signup-verification-success'
                      : errors.verificationCode
                        ? 'signup-verification-error'
                        : undefined
                  }
                  state={verificationState}
                  className={cn(
                    'h-12 px-4',
                    verificationState === 'default' && 'border-border-default',
                    showVerificationTimer && 'pr-16'
                  )}
                  icon={
                    showVerificationTimer ? (
                      <VerificationTimer remainingSeconds={remainingSeconds} />
                    ) : undefined
                  }
                  {...register('verificationCode', {
                    onChange: () => clearErrors('verificationCode'),
                  })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="large"
                className="h-12 w-21.5 shrink-0 px-5"
                disabled={emailVerified || isVerifyingCode}
                onClick={onConfirmCode}
              >
                확인
              </Button>
            </div>
            {emailVerified ? (
              <FieldSuccess
                id="signup-verification-success"
                message="이메일 인증이 완료됐어요"
              />
            ) : errors.verificationCode?.message ? (
              <FieldError
                id="signup-verification-error"
                message={errors.verificationCode.message}
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password"
            className="flex items-center gap-1 text-h4 text-text-default"
          >
            비밀번호
            <p className="text-h4 text-system-error text-system-alert">*</p>
          </label>
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="비밀번호를 입력해 주세요"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password
                ? 'signup-password-hint signup-password-error'
                : 'signup-password-hint'
            }
            state={errors.password ? 'error' : 'default'}
            className={cn('px-4', !errors.password && 'border-border-default')}
            icon={
              <PasswordVisibilityButton
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            }
            {...register('password')}
          />
          <p id="signup-password-hint" className="text-c2 text-text-info">
            영문, 숫자, 특수문자를 조합한 8자 이상
          </p>
          {errors.password?.message ? (
            <FieldError
              id="signup-password-error"
              message={errors.password.message}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password-confirm"
            className="flex items-center gap-1 text-h4 text-text-default"
          >
            비밀번호 확인
            <p className="text-h4 text-system-error text-system-alert">*</p>
          </label>
          <Input
            id="signup-password-confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            aria-invalid={!!errors.passwordConfirm}
            aria-describedby={
              errors.passwordConfirm
                ? 'signup-password-confirm-error'
                : undefined
            }
            state={errors.passwordConfirm ? 'error' : 'default'}
            className={cn(
              'px-4',
              !errors.passwordConfirm && 'border-border-default'
            )}
            icon={
              <PasswordVisibilityButton
                visible={showPasswordConfirm}
                onToggle={() => setShowPasswordConfirm((prev) => !prev)}
              />
            }
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm?.message ? (
            <FieldError
              id="signup-password-confirm-error"
              message={errors.passwordConfirm.message}
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
          disabled={isSigningUp}
        >
          계정 만들기
        </Button>
        <p className="text-center text-c1 text-text-sub">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="underline">
            로그인하기
          </Link>
        </p>
      </div>
    </form>
  );
}

export { SignupForm };
