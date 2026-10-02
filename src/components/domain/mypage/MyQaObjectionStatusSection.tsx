import { cn } from '@/lib/utils';
import type { MyQaObjection, MyQaParticipationStatus } from '@/types/mypage';

type MyQaObjectionStatusSectionProps = {
  status: MyQaParticipationStatus;
  objection: MyQaObjection;
};

const OBJECTION_STEPS = [
  { key: 'SUBMITTED', label: '접수 완료' },
  { key: 'REVIEWING', label: '검토 중' },
  { key: 'RESOLVED', label: '검토 완료' },
] as const;

/**
 * 백엔드에 "운영팀이 실제로 보기 시작했는지"를 구분하는 상태가 없어(ERD 기준),
 * 접수와 검토 중을 구분할 방법이 없다. 그래서 해결되기 전까지는 항상
 * 첫 단계(접수 완료)로 고정하고, 결과가 나왔을 때만 마지막 단계로 넘어간다.
 */
function getCurrentStepIndex(status: MyQaParticipationStatus): number {
  if (status === 'DISPUTE_RESOLVED') return 2;
  return 0;
}

function MyQaObjectionStatusSection({
  status,
  objection,
}: MyQaObjectionStatusSectionProps) {
  const currentStepIndex = getCurrentStepIndex(status);
  const resolution = objection.resolution;
  const isAccepted = resolution?.result === 'ACCEPTED';

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-h4 text-text-default">이의제기 처리 현황</h3>
      <div className="flex flex-col gap-6 rounded-lg border border-gray-300 p-6">
        <p className="text-b2 text-text-default">
          {objection.submittedAt} 접수 · 검토는 영업일 기준 최대 3일이
          소요돼요.
        </p>

        <div className="flex items-start justify-center">
          {OBJECTION_STEPS.map((step, index) => (
            <div key={step.key} className="flex items-start">
              {index > 0 && <div className="mt-4 h-px w-20 bg-gray-200" />}
              <div className="flex w-20 flex-col items-center gap-2">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    index === currentStepIndex ? 'bg-rust-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'block size-4 mask-[url(/icons/check.svg)] mask-center mask-contain mask-no-repeat',
                      index === currentStepIndex ? 'bg-white' : 'bg-gray-400'
                    )}
                  />
                </span>
                <p
                  className={cn(
                    'text-b2 text-center',
                    index === currentStepIndex
                      ? 'font-bold text-text-default'
                      : 'text-text-sub'
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {resolution && (
          <div
            className={cn(
              'flex flex-col gap-3 rounded-lg p-4',
              isAccepted ? 'bg-green-50' : 'bg-rust-50'
            )}
          >
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  'block size-4 shrink-0 mask-center mask-contain mask-no-repeat',
                  isAccepted
                    ? 'bg-green-600 mask-[url(/icons/check.svg)]'
                    : 'bg-rust-600 mask-[url(/icons/x.svg)]'
                )}
              />
              <p
                className={cn(
                  'text-b2 font-bold',
                  isAccepted ? 'text-green-600' : 'text-rust-600'
                )}
              >
                {isAccepted
                  ? '이의제기가 인정되었어요'
                  : '이의제기가 기각되었어요'}
              </p>
            </div>
            <div
              className={cn(
                'flex flex-col gap-1 border-t pt-3',
                isAccepted ? 'border-green-200' : 'border-rust-200'
              )}
            >
              <p className="text-c1 text-text-sub">운영팀 검토 의견</p>
              <p className="text-b2 text-text-default whitespace-pre-wrap">
                {resolution.opinion}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { MyQaObjectionStatusSection };
export type { MyQaObjectionStatusSectionProps };
