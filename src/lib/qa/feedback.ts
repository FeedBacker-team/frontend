import type {
  QaFeedbackFormValues,
  QaFeedbackFormResponse,
  QaFeedbackQuestion,
  SubmitQaFeedbackRequest,
} from '@/types/qa';

function normalizeQaFeedbackQuestions(
  response: QaFeedbackFormResponse
): QaFeedbackQuestion[] {
  const choiceQuestions: QaFeedbackQuestion[] =
    response.choiceQuestionResponses.map((question) => ({
      ...question,
      type:
        question.maxSelectionCount === 1
          ? 'SINGLE_CHOICE'
          : 'MULTIPLE_CHOICE',
    }));
  const subjectiveQuestions: QaFeedbackQuestion[] =
    response.subjectiveQuestionResponses.map((question) => ({
      ...question,
      type: 'SUBJECTIVE',
      allowImageAttachment: question.allowImageAttachment ?? false,
    }));

  return [...choiceQuestions, ...subjectiveQuestions].sort(
    (a, b) => a.order - b.order
  );
}

function createQaFeedbackDefaultValues(
  questions: QaFeedbackQuestion[]
): QaFeedbackFormValues {
  return {
    answers: Object.fromEntries(
      questions.map((question) => [
        String(question.order),
        { selectedOptions: [], text: '', image: null },
      ])
    ),
  };
}

function mergeQaFeedbackDraftValues(
  questions: QaFeedbackQuestion[],
  draftValues: QaFeedbackFormValues
): QaFeedbackFormValues {
  const values = createQaFeedbackDefaultValues(questions);

  questions.forEach((question) => {
    const order = String(question.order);
    const draftAnswer = draftValues.answers[order];

    if (!draftAnswer) {
      return;
    }

    if (question.type === 'SUBJECTIVE') {
      values.answers[order].text = draftAnswer.text;
      values.answers[order].image = null;
      return;
    }

    values.answers[order].selectedOptions = draftAnswer.selectedOptions
      .filter(
        (option, index, options) =>
          option >= 1 &&
          option <= question.optionText.length &&
          options.indexOf(option) === index
      )
      .slice(0, question.maxSelectionCount);
  });

  return values;
}

function hasQaFeedbackAnswers(values: QaFeedbackFormValues) {
  return Object.values(values.answers).some(
    (answer) =>
      answer.selectedOptions.length > 0 ||
      answer.text.trim().length > 0 ||
      answer.image !== null
  );
}

function buildSubmitQaFeedbackRequest(
  feedbackPostId: string,
  questions: QaFeedbackQuestion[],
  values: QaFeedbackFormValues,
  uploadedImagePaths: Partial<Record<number, string[]>> = {}
): SubmitQaFeedbackRequest {
  const choiceAnswers = questions
    .filter((question) => question.type !== 'SUBJECTIVE')
    .map((question) => {
      const selectedOptions =
        values.answers[String(question.order)]?.selectedOptions ?? [];

      return {
        order: question.order,
        selectedOption:
          selectedOptions.length > 0
            ? selectedOptions.map((option) => option - 1)
            : null,
        images: [],
      };
    });
  const subjectiveAnswers = questions
    .filter((question) => question.type === 'SUBJECTIVE')
    .map((question) => ({
      order: question.order,
      text: values.answers[String(question.order)]?.text.trim() ?? '',
      images: (uploadedImagePaths[question.order] ?? []).map((path, index) => ({
        type: 'POST_THUMBNAIL' as const,
        order: index,
        path,
      })),
    }));

  return {
    feedbackPostId,
    questionAnswer: {
      choiceAnswers,
      subjectiveAnswers,
    },
  };
}

export {
  buildSubmitQaFeedbackRequest,
  createQaFeedbackDefaultValues,
  hasQaFeedbackAnswers,
  mergeQaFeedbackDraftValues,
  normalizeQaFeedbackQuestions,
};
