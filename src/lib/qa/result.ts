import { format } from 'date-fns';

import { PROJECT_TAG_LABEL } from '@/constants/project';
import { UNKNOWN_REVIEWER_NICKNAME } from '@/lib/feedback';
import type {
  MyQaResultDetail,
  MyQaResultTesterAnswer,
  QaContentType,
  QaFeedbackQuestion,
  QaResultChoiceOptionStat,
  QaResultQuestion,
} from '@/types/mypage';
import type {
  QaFeedbackChoiceQuestionResponse,
  QaFeedbackFormResponse,
  QaFeedbackSubjectiveQuestionResponse,
  QaResultFeedbackResponse,
  QaResultResponse,
} from '@/types/qa';

type ChoiceQuestionMeta = Pick<
  QaFeedbackChoiceQuestionResponse,
  'isRequire' | 'maxSelectionCount'
>;

function buildChoiceMeta(form: QaFeedbackFormResponse) {
  return new Map<number, ChoiceQuestionMeta>(
    form.choiceQuestionResponses.map((question) => [
      question.order,
      {
        isRequire: question.isRequire,
        maxSelectionCount: question.maxSelectionCount,
      },
    ])
  );
}

function buildSubjectiveMeta(form: QaFeedbackFormResponse) {
  return new Map<number, boolean>(
    form.subjectiveQuestionResponses.map((question) => [
      question.order,
      question.isRequire,
    ])
  );
}

function toContentType(type: QaResultResponse['type']): QaContentType {
  return type === 'IMAGE' ? '이미지형' : '링크형';
}

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function toDateTimeDisplay(value: string) {
  return format(new Date(value), 'yyyy-MM-dd HH:mm');
}

function toPercent(count: number, responseCount: number) {
  return responseCount === 0
    ? 0
    : Math.round((count / responseCount) * 1000) / 10;
}

function buildTesterFeedbackQuestions(
  answer: QaResultFeedbackResponse['questionAnswer'],
  choiceMeta: Map<number, ChoiceQuestionMeta>,
  subjectiveMeta: Map<number, boolean>
): QaFeedbackQuestion[] {
  const choiceQuestions: QaFeedbackQuestion[] =
    answer.choiceQuestionAnswerResponses.map((question) => {
      const meta = choiceMeta.get(question.order);
      const selectedLabels = (question.selectedOption ?? [])
        .map((index) => question.optionText[index - 1])
        .filter((option): option is string => option !== undefined);

      if (meta?.maxSelectionCount === 1) {
        return {
          id: `choice-${question.order}`,
          order: question.order,
          required: meta?.isRequire ?? true,
          type: 'SINGLE_CHOICE',
          question: question.questionText,
          options: question.optionText,
          selectedOption: selectedLabels[0] ?? '',
        };
      }

      return {
        id: `choice-${question.order}`,
        order: question.order,
        required: meta?.isRequire ?? true,
        type: 'MULTIPLE_CHOICE',
        question: question.questionText,
        options: question.optionText,
        selectedOptions: selectedLabels,
      };
    });

  const subjectiveQuestions: QaFeedbackQuestion[] =
    answer.subjectiveQuestionAnswerResponses.map((question) => ({
      id: `text-${question.order}`,
      order: question.order,
      required: subjectiveMeta.get(question.order) ?? true,
      type: 'TEXT',
      question: question.questionText,
      answer: question.answerText ?? '',
    }));

  return [...choiceQuestions, ...subjectiveQuestions].sort(
    (a, b) => a.order - b.order
  );
}

function aggregateChoiceQuestionStats(
  question: QaFeedbackChoiceQuestionResponse,
  acceptedResults: QaResultFeedbackResponse[]
): QaResultQuestion {
  const answered = acceptedResults
    .map((result) =>
      result.questionAnswer.choiceQuestionAnswerResponses.find(
        (item) => item.order === question.order
      )
    )
    .filter(
      (item): item is NonNullable<typeof item> =>
        !!item && !!item.selectedOption && item.selectedOption.length > 0
    );
  const responseCount = answered.length;
  const optionStats: QaResultChoiceOptionStat[] = question.optionText.map(
    (option, index) => {
      const count = answered.filter((item) =>
        item.selectedOption?.includes(index + 1)
      ).length;

      return { option, count, percent: toPercent(count, responseCount) };
    }
  );

  return {
    id: `question-${question.order}`,
    order: question.order,
    required: question.isRequire,
    question: question.questionText,
    responseCount,
    type: question.maxSelectionCount === 1 ? 'SINGLE_CHOICE' : 'MULTIPLE_CHOICE',
    optionStats,
  };
}

function aggregateSubjectiveQuestionStats(
  question: QaFeedbackSubjectiveQuestionResponse,
  acceptedResults: QaResultFeedbackResponse[]
): QaResultQuestion {
  const answers = acceptedResults
    .map((result) =>
      result.questionAnswer.subjectiveQuestionAnswerResponses.find(
        (item) => item.order === question.order
      )
    )
    .map((item) => item?.answerText?.trim())
    .filter((answer): answer is string => !!answer);

  return {
    id: `question-${question.order}`,
    order: question.order,
    required: question.isRequire,
    question: question.questionText,
    responseCount: answers.length,
    type: 'TEXT',
    answers,
  };
}

function buildQuestionStats(
  form: QaFeedbackFormResponse,
  acceptedResults: QaResultFeedbackResponse[]
): QaResultQuestion[] {
  const choiceStats = form.choiceQuestionResponses.map((question) =>
    aggregateChoiceQuestionStats(question, acceptedResults)
  );
  const subjectiveStats = form.subjectiveQuestionResponses.map((question) =>
    aggregateSubjectiveQuestionStats(question, acceptedResults)
  );

  return [...choiceStats, ...subjectiveStats].sort(
    (a, b) => a.order - b.order
  );
}

function mapToMyQaResultDetail(
  feedbackPostId: string,
  result: QaResultResponse,
  form: QaFeedbackFormResponse,
  profile: { nickname: string; acorn: number }
): MyQaResultDetail {
  const contentType = toContentType(result.type);
  const acceptedResults = result.feedbackResult.filter(
    (item) => item.status === 'ACCEPTED'
  );
  const choiceMeta = buildChoiceMeta(form);
  const subjectiveMeta = buildSubjectiveMeta(form);
  const usedAcorn = result.rewardAcorn * acceptedResults.length;
  const reviewImages = result.images
    .filter((image) => image.type === 'POST')
    .sort((a, b) => a.order - b.order)
    .map((image) => image.url);

  return {
    id: feedbackPostId,
    title: result.feedbackPostTitle,
    tags: result.tags.map((tag) => PROJECT_TAG_LABEL[tag]),
    authorNickname: result.writerName ?? profile.nickname,
    startDate: toDateOnly(result.startAt),
    endDate: toDateOnly(result.endAt),
    contentType,
    rewardAcorn: result.rewardAcorn,
    ...(contentType === '링크형' && result.serviceLink
      ? { reviewUrl: result.serviceLink }
      : {}),
    ...(contentType === '이미지형' && reviewImages.length > 0
      ? { reviewImages }
      : {}),
    totalAcorn: profile.acorn + usedAcorn,
    usedAcorn,
    questionStats: buildQuestionStats(form, acceptedResults),
    testerAnswers: acceptedResults.map(
      (item): MyQaResultTesterAnswer => ({
        id: item.feedbackId,
        reviewerNickname: item.testerName ?? UNKNOWN_REVIEWER_NICKNAME,
        submittedAt: toDateTimeDisplay(item.submitAt),
        feedbackQuestions: buildTesterFeedbackQuestions(
          item.questionAnswer,
          choiceMeta,
          subjectiveMeta
        ),
      })
    ),
  };
}

export { mapToMyQaResultDetail };
