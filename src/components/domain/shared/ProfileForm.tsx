'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Sonner';
import { Tag } from '@/components/common/Tag';
import { UserError, type UpdateProfileResponse } from '@/apis/users';
import { ALLOWED_IMAGE_TYPES } from '@/constants/file';
import { PROFILE_JOBS, PROFILE_NICKNAME_MAX_LENGTH } from '@/constants/profile';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useUploadImages } from '@/hooks/useImages';
import {
  profileKeys,
  useCheckNickname,
  useUpdateProfile,
} from '@/hooks/useProfile';
import { useTags } from '@/hooks/useTags';
import { extractImagePathFromUrl } from '@/lib/image';
import {
  profileCompleteSchema,
  type ProfileCompleteFormValues,
} from '@/lib/schemas/profile';
import { cn } from '@/lib/utils';

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
  return error instanceof UserError ? error.message : fallbackMessage;
}

type ProfileFormProps = {
  /** 완성 모드와 수정 모드에서 성공 처리와 안내 문구가 다릅니다. */
  mode?: 'complete' | 'edit';
  /** 수정 모드에서 폼을 미리 채울 기존 프로필 값. 완성 모드에서는 생략합니다. */
  defaultValues?: Partial<ProfileCompleteFormValues>;
  /** 수정 모드에서 미리 보여줄 기존 프로필 이미지 URL. */
  defaultImageUrl?: string | null;
  /** 제출 버튼 레이블. 완성/수정 화면에서 문구가 다릅니다. */
  submitLabel: string;
  /** 저장 성공 시 호출됩니다. 완성 화면은 라우팅을, 수정 화면은 모달 닫기를 담당합니다. */
  onSuccess: (data: UpdateProfileResponse) => void;
};

function ProfileForm({
  mode = 'complete',
  defaultValues,
  defaultImageUrl = null,
  submitLabel,
  onSuccess,
}: ProfileFormProps) {
  const defaultImagePath = defaultImageUrl
    ? extractImagePathFromUrl(defaultImageUrl)
    : null;
  const queryClient = useQueryClient();
  const { mutate: saveProfile, isPending: isSaving } = useUpdateProfile();
  const { mutateAsync: uploadImageFiles, isPending: isImageUploading } =
    useUploadImages();
  const { mutate: checkNickname, isPending: isCheckingNickname } =
    useCheckNickname();
  const {
    data: interestTags = [],
    isPending: isTagsPending,
    isError: isTagsError,
    isFetching: isTagsFetching,
    refetch: refetchTags,
  } = useTags();
  const [nicknameVerified, setNicknameVerified] = useState(
    !!defaultValues?.nickname
  );
  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    path: string;
  } | null>(null);
  const {
    inputRef: imageInputRef,
    previewUrl,
    selectedFile,
    selectFile,
    remove: removeImage,
  } = useImageUpload({
    onError: (message) => toast.error(message),
  });
  const isSubmitPending =
    isSaving || isImageUploading || isTagsPending || isTagsError;
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
      nickname: defaultValues?.nickname ?? '',
      intro_link: defaultValues?.intro_link ?? '',
      interests: defaultValues?.interests ?? [],
      ...(defaultValues?.role ? { role: defaultValues.role } : {}),
    },
  });

  const role = useWatch({ control, name: 'role' });
  const interests = useWatch({ control, name: 'interests' });

  const avatarSrc = previewUrl ?? defaultImageUrl;

  const handleSelectRole = (value: ProfileCompleteFormValues['role']) => {
    setValue('role', value, { shouldValidate: true, shouldDirty: true });
  };

  const handleToggleInterest = (value: string) => {
    const current = getValues('interests');
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setValue('interests', next, { shouldDirty: true });
  };

  const handleRemoveAvatar = () => {
    removeImage();
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

  const onSubmit = async (values: ProfileCompleteFormValues) => {
    if (!nicknameVerified) {
      setError('nickname', { message: '닉네임 중복 확인을 해주세요' });
      return;
    }

    let profileImagePath: string | undefined = defaultImagePath ?? undefined;

    if (selectedFile) {
      if (uploadedImage?.file === selectedFile) {
        profileImagePath = uploadedImage.path;
      } else {
        try {
          const [uploadedPath] = await uploadImageFiles([selectedFile]);
          profileImagePath = uploadedPath;
          setUploadedImage({
            file: selectedFile,
            path: uploadedPath,
          });
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : '이미지 업로드에 실패했습니다'
          );
          return;
        }
      }
    }

    saveProfile(
      {
        nickname: values.nickname,
        role: values.role,
        intro_link: values.intro_link || undefined,
        interests: values.interests.filter((interest) =>
          interestTags.some((tag) => tag.code === interest)
        ),
        profile_image_path: profileImagePath,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: profileKeys.me() });
          if (mode === 'edit') {
            toast.success('프로필 수정 완료되었습니다');
          }
          onSuccess(data);
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
      <div className="flex justify-center">
        <div className="relative size-20">
          <button
            type="button"
            aria-label="프로필 사진 등록"
            disabled={isSubmitPending}
            onClick={() => imageInputRef.current?.click()}
            className="size-20 cursor-pointer overflow-hidden rounded-full disabled:cursor-not-allowed"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt=""
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Image
                src="/icons/basic-avatars.svg"
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
              disabled={isSubmitPending}
              onClick={handleRemoveAvatar}
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
          disabled={isSubmitPending}
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
          {isTagsPending ? (
            <p role="status" className="text-c1 text-text-sub">
              관심 분야를 불러오는 중이에요.
            </p>
          ) : isTagsError ? (
            <div className="flex items-center gap-2">
              <p role="alert" className="text-c1 text-system-alert">
                관심 분야를 불러오지 못했습니다.
              </p>
              <Button
                type="button"
                variant="outline"
                size="small"
                disabled={isTagsFetching}
                onClick={() => void refetchTags()}
              >
                다시 시도
              </Button>
            </div>
          ) : (
            <div
              role="group"
              aria-label="나의 관심 분야"
              className="flex flex-wrap gap-2"
            >
              {interestTags.map((tag) => (
                <Tag
                  key={tag.code}
                  value={tag.code}
                  label={tag.displayName}
                  selected={interests?.includes(tag.code) ?? false}
                  onClick={handleToggleInterest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="secondary"
        size="large"
        className="w-full rounded-xl"
        disabled={isSubmitPending}
      >
        {submitLabel}
      </Button>
    </form>
  );
}

export { ProfileForm };
export type { ProfileFormProps };
