'use client';

import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { FileUpload, FileUploadItem } from '@/components/common/FileUpload';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Sonner';
import { Tag } from '@/components/common/Tag';
import { Textarea } from '@/components/common/Textarea';
import { ALLOWED_IMAGE_TYPES } from '@/constants/file';
import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TAGS,
  PROJECT_TITLE_MAX_LENGTH,
  PROJECT_URL_MAX_LENGTH,
} from '@/constants/project';
import { useDeleteImage, useUploadImage } from '@/hooks/useFiles';
import { useCreateProject } from '@/hooks/useProjects';
import {
  projectFormSchema,
  type ProjectRegisterFormValues,
} from '@/lib/schemas/project';
import { cn } from '@/lib/utils';
import { validateImageFile } from '@/lib/validateImageFile';
import { FileError } from '@/types/file';
import {
  ProjectError,
  type ProjectFormValues,
  type ProjectImageValue,
  type ProjectTag,
} from '@/types/project';

const INITIAL_VALUES: ProjectFormValues = {
  title: '',
  description: '',
  tags: [],
  image: null,
  url: '',
};

function controlClass(hasError: boolean) {
  return cn('px-4', !hasError && 'border-gray-400');
}

function getProjectErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof ProjectError ? error.message : fallbackMessage;
}

function getFileErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof FileError ? error.message : fallbackMessage;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
}

function formatFileType(type: string) {
  return type === 'image/jpeg'
    ? 'JPG'
    : type.replace('image/', '').toUpperCase();
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
        className="block size-5 shrink-0 bg-system-alert mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
      />
      {message}
    </p>
  );
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  description?: string;
  htmlFor?: string;
  children: ReactNode;
};

function FormField({
  label,
  required = false,
  description,
  htmlFor,
  children,
}: FormFieldProps) {
  const Label = htmlFor ? 'label' : 'p';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <Label htmlFor={htmlFor} className="text-h4 text-text-default">
          {label}
          {required ? (
            <span className="ml-1 text-system-alert" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
        {description ? (
          <p className="text-[0.875rem] leading-5 text-text-sub">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

type ProjectRegisterFormProps = {
  mode?: 'register' | 'edit';
  initialValues?: ProjectFormValues;
};

function ProjectRegisterForm({
  mode = 'register',
  initialValues = INITIAL_VALUES,
}: ProjectRegisterFormProps) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: uploadImageFile, isPending: isUploadingImage } =
    useUploadImage();
  const { mutate: deleteImageFile, isPending: isDeletingImage } =
    useDeleteImage();

  const [imageFile, setImageFile] = useState<ProjectImageValue | null>(
    initialValues.image
  );
  const [imageError, setImageError] = useState<{
    file: ProjectImageValue;
    message: ReactNode;
  } | null>(null);
  const [imageRequiredError, setImageRequiredError] = useState(false);
  const [uploaded, setUploaded] = useState<{
    file_id: number;
    image_url: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProjectRegisterFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialValues.title,
      description: initialValues.description,
      tags: initialValues.tags,
      url: initialValues.url,
    },
  });

  const tags = useWatch({ control, name: 'tags' });
  const isImagePending = isUploadingImage || isDeletingImage;
  const showImageError = imageRequiredError || !!imageError;

  const handleToggleTag = (value: string) => {
    const selectedTag = value as ProjectTag;
    const current = getValues('tags');

    setValue(
      'tags',
      current.includes(selectedTag)
        ? current.filter((tag) => tag !== selectedTag)
        : [...current, selectedTag],
      { shouldDirty: true }
    );
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    const result = validateImageFile(file);
    if (!result.ok) {
      setImageError({ file, message: result.message });
      setImageFile(null);
      return;
    }

    setImageError(null);
    setImageRequiredError(false);
    setImageFile(file);

    uploadImageFile(file, {
      onSuccess: (data) => {
        setUploaded({ file_id: data.file_id, image_url: data.image_url });
      },
      onError: (error) => {
        setImageError({
          file,
          message: getFileErrorMessage(error, '이미지 업로드에 실패했습니다'),
        });
        setImageFile(null);
      },
    });
  };

  const handleImageRemove = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setImageError(null);

    if (uploaded) {
      deleteImageFile(uploaded.file_id, {
        onSuccess: () => {
          setUploaded(null);
          setImageFile(null);
        },
        onError: (error) => {
          toast.error(getFileErrorMessage(error, '이미지 삭제에 실패했습니다'));
        },
      });
      return;
    }

    setImageFile(null);
  };

  const onSubmit = (values: ProjectRegisterFormValues) => {
    if (!uploaded) {
      setImageRequiredError(true);
      return;
    }

    if (isEdit) {
      // 프로젝트 수정 API 연동
      return;
    }

    createProject(
      {
        title: values.title,
        description: values.description,
        tags: values.tags,
        image_url: uploaded.image_url,
        url: values.url,
      },
      {
        onSuccess: (data) => {
          router.push(`/projects/${data.project_id}`);
        },
        onError: (error) => {
          toast.error(
            getProjectErrorMessage(error, '프로젝트 등록에 실패했습니다')
          );
        },
      }
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-14 rounded-2xl bg-white p-9"
    >
      <FormField
        label="제목"
        required
        htmlFor="project-title"
        description="어떤 프로젝트인지 한눈에 알 수 있는 제목을 입력해 주세요."
      >
        <Input
          id="project-title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'project-title-error' : undefined}
          maxLength={PROJECT_TITLE_MAX_LENGTH}
          state={errors.title ? 'error' : 'default'}
          className={cn('h-12', controlClass(!!errors.title))}
          placeholder="예) AI 기반 B2B 웹 분석 플랫폼, AI-Biz"
          {...register('title')}
        />
        {errors.title?.message ? (
          <FieldError id="project-title-error" message={errors.title.message} />
        ) : null}
      </FormField>

      <FormField
        label="설명"
        required
        htmlFor="project-description"
        description="어떤 서비스인가요? 주요 기능과 특징을 자유롭게 적어주세요."
      >
        <Textarea
          id="project-description"
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? 'project-description-error' : undefined
          }
          maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
          state={errors.description ? 'error' : 'default'}
          className={cn(
            'field-sizing-content',
            controlClass(!!errors.description)
          )}
          placeholder={
            '예) 고객의 웹 방문 행동 패턴을 AI가 실시간 분석해 맞춤형 리포트를 생성해 줍니다.\nB2B SaaS 기업의 데이터 기반 의사결정과 이탈률 개선을 목표로 합니다.'
          }
          {...register('description')}
        />
        {errors.description?.message ? (
          <FieldError
            id="project-description-error"
            message={errors.description.message}
          />
        ) : null}
      </FormField>

      <FormField label="이 프로젝트의 분야">
        <div
          role="group"
          aria-label="이 프로젝트의 분야"
          className="flex flex-wrap gap-2"
        >
          {PROJECT_TAGS.map((tag) => (
            <Tag
              key={tag.value}
              value={tag.value}
              label={tag.label}
              selected={tags?.includes(tag.value) ?? false}
              onClick={handleToggleTag}
            />
          ))}
        </div>
      </FormField>

      <FormField label="프로젝트 대표 이미지" required htmlFor="project-image">
        <FileUpload
          ref={imageInputRef}
          id="project-image"
          name="image"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          disabled={isImagePending}
          onChange={handleImageChange}
          state={showImageError ? 'error' : 'default'}
          title="파일을 이곳으로 드래그하거나 클릭하여 업로드하세요"
          description="PNG, JPG 형식 지원 · 파일당 최대 5MB (최대 1개)"
        />
        {imageError ? (
          <FileUploadItem
            state="error"
            errorMessage={imageError.message}
            onRemove={handleImageRemove}
            label={`${imageError.file.name} [${formatFileType(imageError.file.type)}, ${formatFileSize(imageError.file.size)}]`}
          />
        ) : imageFile ? (
          <FileUploadItem
            onRemove={handleImageRemove}
            label={`${imageFile.name} [${formatFileType(imageFile.type)}, ${formatFileSize(imageFile.size)}]`}
          />
        ) : imageRequiredError ? (
          <FieldError
            id="project-image-error"
            message="프로젝트 대표 이미지를 등록해 주세요"
          />
        ) : null}
      </FormField>

      <FormField
        label="프로젝트 URL"
        required
        htmlFor="project-url"
        description="서비스 배포 주소, GitHub, Figma 등 프로젝트 관련 링크를 입력해 주세요."
      >
        <Input
          id="project-url"
          type="url"
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? 'project-url-error' : undefined}
          maxLength={PROJECT_URL_MAX_LENGTH}
          state={errors.url ? 'error' : 'default'}
          className={cn('h-12', controlClass(!!errors.url))}
          placeholder="https://"
          {...register('url')}
        />
        {errors.url?.message ? (
          <FieldError id="project-url-error" message={errors.url.message} />
        ) : null}
      </FormField>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="medium"
          className="h-12 rounded-xl px-6"
          onClick={() => router.push('/')}
        >
          취소
        </Button>
        <div className="flex items-center gap-2">
          {isEdit ? null : (
            <Button
              type="button"
              variant="secondary"
              size="medium"
              className="h-12 rounded-xl px-5"
            >
              임시저장
            </Button>
          )}
          <Button
            type="submit"
            size="medium"
            className="h-12 rounded-xl px-12"
            disabled={isCreating || isImagePending}
          >
            {isEdit ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export { ProjectRegisterForm };
