type MyQaStatusProps = {
  nickname: string;
  pendingFeedbackCount: number;
  submissionPendingCount: number;
  reviewingCount: number;
};

type StatusCountProps = {
  label: string;
  count: number;
};

function StatusCount({ label, count }: StatusCountProps) {
  return (
    <span className="flex items-center gap-1 text-c1 text-text-sub">
      {label}
      <span className="rounded-full bg-rust-50 px-1.5 py-0.5 text-c2 text-rust-600">
        {count}
      </span>
    </span>
  );
}

function MyQaStatus({
  nickname,
  pendingFeedbackCount,
  submissionPendingCount,
  reviewingCount,
}: MyQaStatusProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl bg-bg-default px-5 py-4">
      <h2 className="text-h4 text-text-default">
        <span className="text-rust-600">{nickname}</span> 님의 QA 현황
      </h2>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border-default p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-c1 text-text-default">
              <span
                aria-hidden
                className="size-4 shrink-0 bg-current mask-[url(/icons/megaphone.svg)] mask-center mask-contain mask-no-repeat"
              />
              모집 중인 QA
            </div>
            <span
              aria-hidden
              className="size-5 shrink-0 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
            />
          </div>
          <StatusCount label="미처리 피드백" count={pendingFeedbackCount} />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border-default p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-c1 text-text-default">
              <span
                aria-hidden
                className="size-4 shrink-0 bg-current mask-[url(/icons/check.svg)] mask-center mask-contain mask-no-repeat"
              />
              참여 중인 QA
            </div>
            <span
              aria-hidden
              className="size-5 shrink-0 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
            />
          </div>
          <div className="flex items-center gap-5">
            <StatusCount label="제출 대기" count={submissionPendingCount} />
            <StatusCount label="검토 중" count={reviewingCount} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { MyQaStatus };
export type { MyQaStatusProps };
