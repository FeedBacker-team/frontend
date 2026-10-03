import { format } from 'date-fns';

import {
  QA_CHOICE_QUESTION_COST,
  QA_SUBJECTIVE_QUESTION_COST,
} from '@/constants/qa';
import type {
  CreateQaRecruitmentRequest,
  QaRecruitChoiceQuestionRequest,
  QaRecruitFormValues,
  QaRecruitImageRequest,
  QaRecruitSubjectiveQuestionRequest,
} from '@/types/qa';

function getQaRewardAcorn(values: QaRecruitFormValues) {
  return values.questions.reduce(
    (total, question) =>
      total +
      (question.type === 'SUBJECTIVE'
        ? QA_SUBJECTIVE_QUESTION_COST
        : QA_CHOICE_QUESTION_COST),
    0
  );
}

function buildQaRecruitmentRequest(
  values: QaRecruitFormValues,
  uploadedPaths: string[],
  now = new Date()
): CreateQaRecruitmentRequest {
  if (values.slotCapacity == null) {
    throw new Error('모집 인원을 확인해 주세요.');
  }

  if (values.target === 'IMAGE' && uploadedPaths.length === 0) {
    throw new Error('테스트 이미지 업로드 결과를 확인해 주세요.');
  }

  const choiceQuestions: QaRecruitChoiceQuestionRequest[] = [];
  const subjectiveQuestions: QaRecruitSubjectiveQuestionRequest[] = [];

  values.questions.forEach((question, index) => {
    const order = index + 1;

    if (question.type === 'SUBJECTIVE') {
      subjectiveQuestions.push({
        order,
        questionText: question.questionText.trim(),
        isRequire: question.isRequire,
        minimumLength: question.minimumLength ?? undefined,
        allowImageAttachment: question.allowImageAttachment,
      });
      return;
    }

    choiceQuestions.push({
      order,
      questionText: question.questionText.trim(),
      optionText: question.options.map((option) => option.trim()),
      maxSelectionCount: question.maxSelectionCount,
      isRequire: question.isRequire,
    });
  });

  const images: QaRecruitImageRequest[] | undefined =
    values.target === 'IMAGE'
      ? uploadedPaths.map((path, index) => ({
          type: 'POST',
          order: index,
          path,
        }))
      : undefined;
  const rewardAcorn = getQaRewardAcorn(values);

  return {
    projectId: values.projectId,
    title: values.title.trim(),
    description: values.description.trim(),
    slotCapacity: values.slotCapacity,
    depositAcorn: rewardAcorn * values.slotCapacity,
    rewardAcorn,
    startAt: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
    endAt: `${values.endAt}T23:59:59`,
    target: values.target,
    serviceUrl:
      values.target === 'SERVICE_LINK' ? values.serviceUrl.trim() : null,
    images,
    choiceQuestions: choiceQuestions.length > 0 ? choiceQuestions : undefined,
    subjectiveQuestions:
      subjectiveQuestions.length > 0 ? subjectiveQuestions : undefined,
  };
}

export { buildQaRecruitmentRequest, getQaRewardAcorn };
