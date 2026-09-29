import Image from 'next/image';

import { Button } from '@/components/common/Button';
import type { QaFeedbackQuestion } from '@/types/qa';

type QaFeedbackSummaryCardProps = {
  questions: QaFeedbackQuestion[];
  rewardAcorn: number;
  onAbandon: () => void;
};

function QaFeedbackSummaryCard({
  questions,
  rewardAcorn,
  onAbandon,
}: QaFeedbackSummaryCardProps) {
  const choiceCount = questions.filter(
    (question) => question.type !== 'SUBJECTIVE'
  ).length;
  const subjectiveCount = questions.length - choiceCount;
  const requiredCount = questions.filter(
    (question) => question.isRequire
  ).length;
  const items = [
    { label: '객관식', value: choiceCount },
    { label: '주관식', value: subjectiveCount },
    { label: '필수 문항', value: requiredCount },
  ];

  return (
    <section className="sticky top-10 flex flex-col gap-6 rounded-2xl bg-bg-default p-5">
      <div className="flex flex-col gap-4">
        <h2 className="text-h3 text-text-default">문항 정보</h2>
        <dl className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <dt className="text-c1 text-text-info">{item.label}</dt>
              <dd className="text-h4 text-text-sub">{item.value}문항</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="h-px bg-divider-default" />

      <div className="flex items-center justify-between">
        <span className="text-h4 text-yellow-700">제출 보상</span>
        <span className="flex items-center gap-1 text-h3 text-yellow-800">
          <Image
            src="/images/acorn.svg"
            alt=""
            aria-hidden
            width={12}
            height={16}
            unoptimized
          />
          {rewardAcorn}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="medium"
        className="w-full"
        onClick={onAbandon}
      >
        피드백 포기하기
      </Button>
    </section>
  );
}

export { QaFeedbackSummaryCard };
export type { QaFeedbackSummaryCardProps };
