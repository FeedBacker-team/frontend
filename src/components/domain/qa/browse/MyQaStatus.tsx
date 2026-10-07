import Link from 'next/link';

type MyQaStatusProps = {
  nickname: string;
  recruitingCount: number;
  submissionPendingCount: number;
  reviewingCount: number;
  isLoading?: boolean;
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

function MyQaStatusSkeleton() {
  const statuses = [
    {
      label: '모집 중인 QA',
      iconClass: 'mask-[url(/icons/megaphone.svg)]',
    },
    { label: '참여 중인 QA', iconClass: 'mask-[url(/icons/check.svg)]' },
  ] as const;

  return (
    <section
      aria-label="나의 QA 현황을 불러오는 중"
      aria-busy="true"
      className="flex flex-col gap-3"
    >
      {statuses.map(({ label, iconClass }) => (
        <div
          key={label}
          className="flex flex-col gap-4 rounded-xl border border-border-default bg-bg-default p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-c1 text-text-default">
              <span
                aria-hidden
                className={`size-4 shrink-0 bg-current ${iconClass} mask-center mask-contain mask-no-repeat`}
              />
              {label}
            </div>
            <span
              aria-hidden
              className="size-5 shrink-0 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
            />
          </div>
          <div
            aria-hidden
            className="h-6 w-45 animate-pulse rounded-md bg-bg-deep"
          />
        </div>
      ))}
    </section>
  );
}

function MyQaStatus({
  nickname,
  recruitingCount,
  submissionPendingCount,
  reviewingCount,
  isLoading = false,
}: MyQaStatusProps) {
  if (isLoading) {
    return <MyQaStatusSkeleton />;
  }

  const displayNickname = nickname.trim();

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-bg-default px-5 py-4">
      <h2 className="text-h4 text-text-default">
        {displayNickname ? (
          <>
            <span className="text-rust-600">{displayNickname}</span>님의 QA 현황
          </>
        ) : (
          '나의 QA 현황'
        )}
      </h2>

      <div className="flex flex-col gap-2">
        <Link
          href="/mypage?tab=QA_RECRUIT"
          className="flex flex-col gap-4 rounded-xl border border-border-default p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
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
          <StatusCount label="진행 중" count={recruitingCount} />
        </Link>

        <Link
          href="/mypage?tab=QA_PARTICIPATION"
          className="flex flex-col gap-2 rounded-xl border border-border-default p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
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
        </Link>
      </div>
    </section>
  );
}

export { MyQaStatus, MyQaStatusSkeleton };
export type { MyQaStatusProps };
