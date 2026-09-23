'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Sonner';
import { Tag } from '@/components/common/Tag';
import { ALLOWED_IMAGE_TYPES } from '@/constants/file';
import {
  PROFILE_INTEREST_TAGS,
  PROFILE_JOBS,
  PROFILE_NICKNAME_MAX_LENGTH,
} from '@/constants/profile';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCheckNickname, useUpdateProfile } from '@/hooks/useProfile';
import {
  profileCompleteSchema,
  type ProfileCompleteFormValues,
} from '@/lib/schemas/profile';
import { cn } from '@/lib/utils';
import { ProfileError } from '@/types/profile';

function RequiredMark() {
  return (
    <span className="text-h4 text-system-alert" aria-hidden>
      *
    </span>
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

function getProfileErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof ProfileError ? error.message : fallbackMessage;
}

function ProfileCompleteForm() {
  const router = useRouter();
  const { mutate: saveProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: checkNickname, isPending: isCheckingNickname } =
    useCheckNickname();
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const {
    inputRef: imageInputRef,
    previewUrl,
    uploaded,
    isPending: isImagePending,
    selectFile,
    remove: removeImage,
  } = useImageUpload({
    onError: (message) => toast.error(message),
  });
  const isSubmitPending = isSaving || isImagePending;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    control,
    formState: { errors },
  } = useForm<ProfileCompleteFormValues>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: {
      nickname: '',
      intro_link: '',
      interests: [],
    },
  });

  const role = useWatch({ control, name: 'role' });
  const interests = useWatch({ control, name: 'interests' });

  const handleSelectRole = (value: ProfileCompleteFormValues['role']) => {
    setValue('role', value, { shouldValidate: true, shouldDirty: true });
  };

  const handleToggleInterest = (value: string) => {
    const selected = value as ProfileCompleteFormValues['interests'][number];
    const current = getValues('interests');
    const next = current.includes(selected)
      ? current.filter((item) => item !== selected)
      : [...current, selected];

    setValue('interests', next, { shouldDirty: true });
  };

  const handleCheckNickname = async () => {
    const nicknameOk = await trigger('nickname');
    if (!nicknameOk) {
      return;
    }

    checkNickname(getValues('nickname'), {
      onSuccess: () => {
        clearErrors('nickname');
        setNicknameVerified(true);
      },
      onError: (error) => {
        setNicknameVerified(false);
        setError('nickname', {
          message: getProfileErrorMessage(
            error,
            '닉네임 중복 확인에 실패했습니다'
          ),
        });
      },
    });
  };

  const onSubmit = (values: ProfileCompleteFormValues) => {
    if (!nicknameVerified) {
      setError('nickname', { message: '닉네임 중복 확인을 해주세요' });
      return;
    }

    saveProfile(
      {
        nickname: values.nickname,
        role: values.role,
        intro_link: values.intro_link || undefined,
        interests: values.interests,
        profile_image_url: uploaded?.image_url,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          toast.error(
            getProfileErrorMessage(error, '프로필 저장에 실패했습니다')
          );
        },
      }
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-text-default">프로필 완성하기</h1>
        <p className="text-b2 text-text-sub">
          프로젝트 참여를 위해 간단히 나를 소개해 주세요.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative size-20">
          <button
            type="button"
            aria-label="프로필 사진 등록"
            disabled={isImagePending}
            onClick={() => imageInputRef.current?.click()}
            className="size-20 cursor-pointer overflow-hidden rounded-full disabled:cursor-not-allowed"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt=""
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Image
                src="/icons/Avatars.svg"
                alt=""
                aria-hidden
                width={80}
                height={80}
                unoptimized
                className="size-full"
              />
            )}
          </button>
          {previewUrl ? (
            <button
              type="button"
              aria-label="프로필 사진 삭제"
              disabled={isImagePending}
              onClick={removeImage}
              className="absolute top-0 right-0 size-6 cursor-pointer disabled:cursor-not-allowed"
            >
              <Image
                src="/icons/x-circle.svg"
                alt=""
                aria-hidden
                width={24}
                height={24}
                unoptimized
                className="size-6"
              />
            </button>
          ) : (
            <Image
              src="/icons/plus-circle.svg"
              alt=""
              aria-hidden
              width={24}
              height={24}
              unoptimized
              className="pointer-events-none absolute top-0 right-0 size-6"
            />
          )}
        </div>
        <input
          ref={imageInputRef}
          id="profile-image"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          disabled={isImagePending}
          className="sr-only"
          onChange={selectFile}
        />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-nickname"
            className="flex items-center gap-1 text-h4 text-text-default"
          >
            닉네임
            <RequiredMark />
          </label>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <Input
                id="profile-nickname"
                type="text"
                maxLength={PROFILE_NICKNAME_MAX_LENGTH}
                placeholder="10자 이내로 입력해 주세요"
                aria-invalid={!!errors.nickname}
                aria-describedby={
                  nicknameVerified
                    ? 'profile-nickname-success'
                    : errors.nickname
                      ? 'profile-nickname-error'
                      : undefined
                }
                state={
                  nicknameVerified
                    ? 'completed'
                    : errors.nickname
                      ? 'error'
                      : 'default'
                }
                className={cn(
                  'h-12 px-4',
                  !nicknameVerified &&
                    !errors.nickname &&
                    'border-border-default'
                )}
                {...register('nickname', {
                  onChange: () => {
                    if (nicknameVerified) {
                      setNicknameVerified(false);
                    }
                  },
                })}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="large"
              className="h-12 shrink-0 rounded-xl px-4"
              disabled={nicknameVerified || isCheckingNickname}
              onClick={handleCheckNickname}
            >
              중복 확인
            </Button>
          </div>
          {nicknameVerified ? (
            <FieldSuccess
              id="profile-nickname-success"
              message="사용 가능한 닉네임입니다."
            />
          ) : errors.nickname?.message ? (
            <FieldError
              id="profile-nickname-error"
              message={errors.nickname.message}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1 text-h4 text-text-default">
            직군 선택
            <RequiredMark />
          </p>
          <div
            role="radiogroup"
            aria-label="직군 선택"
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? 'profile-role-error' : undefined}
            className="flex flex-wrap gap-2"
          >
            {PROFILE_JOBS.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                state={role === item.value ? 'checked' : 'unchecked'}
                onClick={() => handleSelectRole(item.value)}
              />
            ))}
          </div>
          {errors.role?.message ? (
            <FieldError id="profile-role-error" message={errors.role.message} />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="profile-link" className="text-h4 text-text-default">
            나를 소개하는 링크 <span className="text-text-info">(선택)</span>
          </label>
          <Input
            id="profile-link"
            type="url"
            placeholder="예) GitHub, 포트폴리오, 블로그 등"
            aria-invalid={!!errors.intro_link}
            aria-describedby={
              errors.intro_link ? 'profile-link-error' : undefined
            }
            state={errors.intro_link ? 'error' : 'default'}
            className={cn(
              'h-12 px-4',
              !errors.intro_link && 'border-border-default'
            )}
            {...register('intro_link')}
          />
          {errors.intro_link?.message ? (
            <FieldError
              id="profile-link-error"
              message={errors.intro_link.message}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-h4 text-text-default">
            나의 관심 분야 <span className="text-text-info">(선택)</span>
          </p>
          <div
            role="group"
            aria-label="나의 관심 분야"
            className="flex flex-wrap gap-2"
          >
            {PROFILE_INTEREST_TAGS.map((tag) => (
              <Tag
                key={tag.value}
                value={tag.value}
                label={tag.label}
                selected={interests?.includes(tag.value) ?? false}
                onClick={handleToggleInterest}
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="secondary"
        size="large"
        className="w-full rounded-xl"
        disabled={isSubmitPending}
      >
        프로필 저장하고 시작하기
      </Button>
    </form>
  );
}

export { ProfileCompleteForm };
