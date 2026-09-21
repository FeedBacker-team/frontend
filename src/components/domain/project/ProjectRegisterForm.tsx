'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
  type ReactNode,
} from 'react';

import { Button } from '@/components/common/Button';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Sonner';
import { Tag } from '@/components/common/Tag';
import { Textarea } from '@/components/common/Textarea';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/constants/file';
import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TAGS,
  PROJECT_TITLE_MAX_LENGTH,
  PROJECT_URL_MAX_LENGTH,
} from '@/constants/project';
import { cn } from '@/lib/utils';
import type {
  ProjectFormErrors,
  ProjectFormValues,
  ProjectTag,
} from '@/types/project';

const INITIAL_VALUES: ProjectFormValues = {
  title: '',
  description: '',
  tags: [],
  image: null,
  url: '',
};

const INITIAL_ERRORS: ProjectFormErrors = {
  title: false,
  description: false,
  image: false,
  url: false,
};

function controlClass(hasError: boolean) {
  return cn('px-4', !hasError && 'border-gray-400');
}

function isValidUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
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

function validate(values: ProjectFormValues): ProjectFormErrors {
  return {
    title: !values.title.trim(),
    description: !values.description.trim(),
    image: !values.image,
    url: !isValidUrl(values.url.trim()),
  };
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
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [errors, setErrors] = useState<ProjectFormErrors>(INITIAL_ERRORS);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleToggleTag = (value: string) => {
    const selectedTag = value as ProjectTag;

    setValues((prev) => ({
      ...prev,
      tags: prev.tags.includes(selectedTag)
        ? prev.tags.filter((tag) => tag !== selectedTag)
        : [...prev.tags, selectedTag],
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('PNG, JPG 형식의 이미지만 등록할 수 있어요.');
    } else if (file && file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('이미지는 파일당 최대 5MB까지 등록할 수 있어요.');
    } else {
      setValues((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: false }));
      return;
    }

    event.target.value = '';
    setValues((prev) => ({ ...prev, image: null }));
  };

  const handleImageRemove = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setValues((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    // API 요청 연결 (register: 등록, edit: 수정)
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
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
          name="title"
          value={values.title}
          onChange={handleChange}
          maxLength={PROJECT_TITLE_MAX_LENGTH}
          state={errors.title ? 'error' : 'default'}
          className={cn('h-12', controlClass(errors.title))}
          placeholder="예) AI 기반 B2B 웹 분석 플랫폼, AI-Biz"
        />
      </FormField>

      <FormField
        label="설명"
        required
        htmlFor="project-description"
        description="어떤 서비스인가요? 주요 기능과 특징을 자유롭게 적어주세요."
      >
        <Textarea
          id="project-description"
          name="description"
          value={values.description}
          onChange={handleChange}
          maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
          state={errors.description ? 'error' : 'default'}
          className={cn(
            'field-sizing-content',
            controlClass(errors.description)
          )}
          placeholder={
            '예) 고객의 웹 방문 행동 패턴을 AI가 실시간 분석해 맞춤형 리포트를 생성해 줍니다.\nB2B SaaS 기업의 데이터 기반 의사결정과 이탈률 개선을 목표로 합니다.'
          }
        />
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
              selected={values.tags.includes(tag.value)}
              onClick={handleToggleTag}
            />
          ))}
        </div>
      </FormField>

      <FormField label="프로젝트 대표 이미지" required htmlFor="project-image">
        <FileDropzone
          ref={imageInputRef}
          id="project-image"
          name="image"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleImageChange}
          state={errors.image ? 'error' : 'default'}
          title="파일을 이곳으로 드래그하거나 클릭하여 업로드하세요"
          description="PNG, JPG 형식 지원 · 파일당 최대 5MB (최대 1개)"
        />
        {values.image ? (
          <div className="flex h-12 items-center justify-between rounded-xl border border-gray-400 bg-white px-4">
            <span className="min-w-0 truncate text-c1 text-text-default">
              {values.image.name} [{formatFileType(values.image.type)},{' '}
              {formatFileSize(values.image.size)}]
            </span>
            <button
              type="button"
              onClick={handleImageRemove}
              className="ml-4 inline-flex shrink-0 cursor-pointer items-center gap-1 text-c1 text-text-default"
            >
              삭제
              <img src="/icons/x.svg" alt="" aria-hidden className="size-5" />
            </button>
          </div>
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
          name="url"
          type="url"
          value={values.url}
          onChange={handleChange}
          maxLength={PROJECT_URL_MAX_LENGTH}
          state={errors.url ? 'error' : 'default'}
          className={cn('h-12', controlClass(errors.url))}
          placeholder="https://"
        />
      </FormField>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="medium"
          className="h-12 rounded-xl px-6"
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
          <Button type="submit" size="medium" className="h-12 rounded-xl px-12">
            {isEdit ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export { ProjectRegisterForm };
