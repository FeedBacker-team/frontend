import type { QaResultChoiceOptionStat } from '@/types/mypage';

const PIE_CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

function formatPercent(percent: number) {
  return Number.isInteger(percent) ? percent : percent.toFixed(1);
}

type MyQaResultPieChartProps = {
  optionStats: QaResultChoiceOptionStat[];
};

function MyQaResultPieChart({ optionStats }: MyQaResultPieChartProps) {
  const segments = optionStats.reduce<
    Array<QaResultChoiceOptionStat & {
      color: string;
      start: number;
      end: number;
      labelX: number;
      labelY: number;
    }>
  >((acc, stat, index) => {
    const start = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const end = start + stat.percent;

    const midAngleDeg = ((start + end) / 2) * 3.6 - 90;
    const midAngleRad = (midAngleDeg * Math.PI) / 180;

    acc.push({
      ...stat,
      color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      start,
      end,
      labelX: 50 + 32 * Math.cos(midAngleRad),
      labelY: 50 + 32 * Math.sin(midAngleRad),
    });

    return acc;
  }, []);

  const gradient = `conic-gradient(${segments
    .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
    .join(', ')})`;

  return (
    <div className="flex flex-wrap items-center gap-10">
      <div
        className="relative size-55 shrink-0 rounded-full"
        style={{ background: gradient }}
      >
        {segments.map((segment) => (
          <span
            key={segment.option}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2 text-b3 font-bold text-white"
            style={{ left: `${segment.labelX}%`, top: `${segment.labelY}%` }}
          >
            {formatPercent(segment.percent)}%
          </span>
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {segments.map((segment) => (
          <li
            key={segment.option}
            className="flex items-center gap-2 text-b3 text-text-default"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            {segment.option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MyQaResultPieChart };
export type { MyQaResultPieChartProps };
