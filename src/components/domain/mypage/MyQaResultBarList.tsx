import type { QaResultChoiceOptionStat } from '@/types/mypage';

function formatPercent(percent: number) {
  return Number.isInteger(percent) ? percent : percent.toFixed(1);
}

type MyQaResultBarListProps = {
  optionStats: QaResultChoiceOptionStat[];
};

function MyQaResultBarList({ optionStats }: MyQaResultBarListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {optionStats.map((stat) => (
        <li key={stat.option} className="flex flex-col gap-1.5">
          <p className="text-b3 text-text-default">{stat.option}</p>
          <div className="flex items-center gap-3">
            <div className="h-6 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-rust-600"
                style={{ width: `${stat.percent}%` }}
              />
            </div>
            <span className="shrink-0 text-c1 text-text-sub">
              {stat.count}명({formatPercent(stat.percent)}%)
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export { MyQaResultBarList };
export type { MyQaResultBarListProps };
