'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/common/Dialog';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { cn } from '@/lib/utils';
import type {
  QaRecruitableProject,
  QaRecruitStep,
  QaTargetType,
} from '@/types/qa';

const TEST_METHODS: Array<{
  value: QaTargetType;
  title: string;
  description: string;
  iconClassName: string;
}> = [
  {
    value: 'SERVICE_LINK',
    title: '링크형 테스트',
    description:
      '서비스 URL을 연결해 실제 서비스의 사용성과 전반적인 피드백을 받아요.',
    iconClassName: 'mask-[url(/icons/link.svg)]',
  },
  {
    value: 'IMAGE',
    title: '이미지형 테스트',
    description:
      'A/B 시안 등 2~3장의 이미지를 올려 테스터의 비교 의견을 모아요.',
    iconClassName: 'mask-[url(/icons/image.svg)]',
  },
];

type QaRecruitSubmitParams = {
  projectId: number;
  targetType: QaTargetType;
};

type QaRecruitDialogProps = {
  open: boolean;
  projects: QaRecruitableProject[];
  onClose: () => void;
  onSubmit: (params: QaRecruitSubmitParams) => void;
};

type ProjectStepProps = {
  projects: QaRecruitableProject[];
  selectedProjectId: number | null;
  onSelectProject: (projectId: number) => void;
};

function ProjectStep({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectStepProps) {
  return (
    <RadioGroup
      size="medium"
      aria-label="QA를 모집할 프로젝트"
      value={selectedProjectId?.toString() ?? ''}
      onValueChange={(value) => onSelectProject(Number(value))}
      className="max-h-80 gap-2 overflow-y-auto pr-1"
    >
      {projects.map((project) => (
        <Radio
          key={project.projectId}
          value={project.projectId.toString()}
          disabled={project.hasActiveQa}
          label={project.title}
          description={project.description}
          className="w-full rounded-[12px] border border-gray-400 p-4 has-data-checked:border-rust-600 has-data-checked:bg-rust-50 has-data-disabled:border-gray-300 has-data-disabled:bg-gray-100"
        />
      ))}
    </RadioGroup>
  );
}

type TestMethodStepProps = {
  project: QaRecruitableProject;
  targetType: QaTargetType;
  onSelectTargetType: (targetType: QaTargetType) => void;
};

function TestMethodStep({
  project,
  targetType,
  onSelectTargetType,
}: TestMethodStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <article className="flex items-center gap-3 rounded-[12px] bg-bg-light px-5 py-4">
        <div className="relative size-13 shrink-0 overflow-hidden rounded-[4px] bg-[#d9d9d9]">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt=""
              fill
              unoptimized
              sizes="52px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <h3 className="text-h4 truncate text-text-default">
            {project.title}
          </h3>
          <p className="text-b3 truncate text-text-sub">
            {project.description}
          </p>
        </div>
      </article>

      <div role="radiogroup" aria-label="QA 테스트 방식" className="flex gap-3">
        {TEST_METHODS.map((method) => {
          const isSelected = targetType === method.value;

          return (
            <button
              key={method.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectTargetType(method.value)}
              className={cn(
                'flex flex-1 cursor-pointer flex-col items-center gap-4 rounded-[12px] px-3 py-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border border-rust-600 bg-rust-50'
                  : 'border border-border-default bg-bg-default hover:bg-bg-light'
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'block size-9 shrink-0 mask-center mask-contain mask-no-repeat',
                  method.iconClassName,
                  isSelected ? 'bg-rust-600' : 'bg-gray-900'
                )}
              />
              <span className="flex w-full flex-col items-center gap-0.5 text-center">
                <span
                  className={cn(
                    'text-h3',
                    isSelected ? 'text-rust-600' : 'text-text-default'
                  )}
                >
                  {method.title}
                </span>
                <span className="text-b3 text-text-sub">
                  {method.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getFirstRecruitableProjectId(projects: QaRecruitableProject[]) {
  return projects.find((project) => !project.hasActiveQa)?.projectId ?? null;
}

function QaRecruitDialog({
  open,
  projects,
  onClose,
  onSubmit,
}: QaRecruitDialogProps) {
  const [step, setStep] = useState<QaRecruitStep>('PROJECT_SELECT');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    () => getFirstRecruitableProjectId(projects)
  );
  const [targetType, setTargetType] =
    useState<QaTargetType>('SERVICE_LINK');
  const selectedProject = projects.find(
    (project) => project.projectId === selectedProjectId
  );

  const reset = () => {
    setStep('PROJECT_SELECT');
    setSelectedProjectId(getFirstRecruitableProjectId(projects));
    setTargetType('SERVICE_LINK');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (selectedProjectId === null) {
      return;
    }

    const params = { projectId: selectedProjectId, targetType };

    reset();
    onSubmit(params);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-135">
        {step === 'PROJECT_SELECT' ? (
          <>
            <DialogHeader
              title="어떤 프로젝트의 QA를 모집할까요?"
              description={`내가 등록한 프로젝트 · ${projects.length}개`}
            />
            <DialogBody>
              <ProjectStep
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                닫기
              </Button>
              <Button
                disabled={selectedProjectId === null}
                onClick={() => setStep('TEST_METHOD')}
              >
                다음
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader
              title="어떤 방식으로 테스트 할까요?"
              description="원하는 피드백 형태에 맞는 방식을 선택해 주세요."
            />
            {selectedProject ? (
              <DialogBody>
                <TestMethodStep
                  project={selectedProject}
                  targetType={targetType}
                  onSelectTargetType={setTargetType}
                />
              </DialogBody>
            ) : null}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('PROJECT_SELECT')}
              >
                이전
              </Button>
              <Button disabled={!selectedProject} onClick={handleSubmit}>
                모집글 작성하기
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { QaRecruitDialog };
export type { QaRecruitDialogProps, QaRecruitSubmitParams };
