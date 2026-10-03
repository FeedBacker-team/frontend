import Image from 'next/image';

type MyQaResultAcornCardProps = {
  totalAcorn: number;
  usedAcorn: number;
};

function MyQaResultAcornCard({ totalAcorn, usedAcorn }: MyQaResultAcornCardProps) {
  const remainingAcorn = totalAcorn - usedAcorn;

  return (
    <aside className="flex h-fit w-80 shrink-0 flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-6">
      <h2 className="text-h3 text-text-default">도토리 사용량</h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-b2">
          <span className="text-text-sub">기존 보유 도토리</span>
          <span className="text-text-default">{totalAcorn}</span>
        </div>
        <div className="flex items-center justify-between text-b2">
          <span className="text-text-sub">이번 QA에 사용한 도토리</span>
          <span className="text-text-default">{usedAcorn}</span>
        </div>
      </div>
      <hr className="border-gray-300" />
      <div className="flex items-center justify-between">
        <span className="text-b2 text-text-default">현재 잔여 도토리</span>
        <span className="flex items-center gap-1 text-h4 text-text-default">
          <Image
            src="/images/acorn.svg"
            alt="도토리"
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
          {remainingAcorn}
        </span>
      </div>
    </aside>
  );
}

export { MyQaResultAcornCard };
export type { MyQaResultAcornCardProps };
