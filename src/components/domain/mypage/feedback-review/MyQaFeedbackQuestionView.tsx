'use client';

import { useState } from 'react';
import Image from 'next/image';

import { CheckBox } from '@/components/common/CheckBox';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import {
  ImageViewer,
  type ImageViewerItem,
} from '@/components/domain/shared/ImageViewer';
import type { QaFeedbackQuestion } from '@/types/mypage';

type MyQaFeedbackQuestionViewProps = {
  question: QaFeedbackQuestion;
};

function MyQaFeedbackQuestionView({
  question,
}: MyQaFeedbackQuestionViewProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const images = question.type === 'TEXT' ? (question.images ?? []) : [];
  const viewerImages: ImageViewerItem[] = images.map((url, index) => ({
    id: `${question.id}-${index}`,
    src: url,
    alt: `${question.order}번 문항 첨부 이미지 ${index + 1}`,
  }));

  return (
    <div className="flex flex-col gap-3">
      <p className="text-h4 text-text-default">
        {question.order}번{' '}
        {question.required ? (
          <span className="text-rust-600">*</span>
        ) : (
          <span className="text-c1 text-text-sub">(선택)</span>
        )}
      </p>
      <p className="text-b2 text-text-default">{question.question}</p>

      {question.type === 'SINGLE_CHOICE' && (
        <RadioGroup
          defaultValue={question.selectedOption}
          className="pointer-events-none"
        >
          {question.options.map((option) => (
            <Radio key={option} value={option} label={option} />
          ))}
        </RadioGroup>
      )}

      {question.type === 'MULTIPLE_CHOICE' && (
        <div className="pointer-events-none flex flex-col gap-3">
          {question.options.map((option) => (
            <CheckBox
              key={option}
              defaultChecked={question.selectedOptions.includes(option)}
              label={option}
            />
          ))}
        </div>
      )}

      {question.type === 'TEXT' && (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-gray-300 p-4 text-b2 text-text-default whitespace-pre-wrap">
            {question.answer}
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`${index + 1}번째 첨부 이미지 크게 보기`}
                  onClick={() => setViewerIndex(index)}
                  className="group relative size-30 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="120px"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-gray-900/0 text-c1 text-gray-50 opacity-0 transition-all group-hover:bg-gray-900/50 group-hover:opacity-100">
                    자세히 보기
                  </span>
                </button>
              ))}
            </div>
          )}

          <ImageViewer
            open={viewerIndex !== null}
            images={viewerImages}
            currentIndex={viewerIndex ?? 0}
            onIndexChange={setViewerIndex}
            onOpenChange={(open) => {
              if (!open) {
                setViewerIndex(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export { MyQaFeedbackQuestionView };
export type { MyQaFeedbackQuestionViewProps };
