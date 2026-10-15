import { formatCompactAmount } from "@/lib/format";
import { revenue } from "@/lib/metrics";
import { periodLabel } from "@/lib/periods";
import type { PeriodType, StatementPeriod } from "@/lib/types";

const CHART_WIDTH = 720;
const CHART_HEIGHT = 240;
const LABEL_SPACE = 28;
const VALUE_SPACE = 20;
const BAR_GAP = 12;

interface RevenueChartProps {
  /** Oldest first. */
  periods: StatementPeriod[];
  periodType: PeriodType;
  currency: string;
}

export function RevenueChart({ periods, periodType, currency }: RevenueChartProps) {
  const bars = periods.map((period) => ({
    periodId: period.periodId,
    label: periodLabel(period, periodType),
    value: revenue(period),
  }));
  const maxValue = Math.max(0, ...bars.map((bar) => bar.value ?? 0));
  if (bars.length === 0 || maxValue === 0) return null;

  const slotWidth = CHART_WIDTH / bars.length;
  const plotHeight = CHART_HEIGHT - LABEL_SPACE - VALUE_SPACE;

  return (
    <figure className="chart panel">
      <figcaption>Revenue</figcaption>
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Revenue by period">
        {bars.map((bar, index) => {
          const barHeight = Math.max(0, ((bar.value ?? 0) / maxValue) * plotHeight);
          const x = index * slotWidth + BAR_GAP / 2;
          const barTop = VALUE_SPACE + plotHeight - barHeight;
          const centerX = x + (slotWidth - BAR_GAP) / 2;
          return (
            <g key={bar.periodId} className="chart-bar">
              <rect x={x} y={barTop} width={slotWidth - BAR_GAP} height={barHeight} rx={3}>
                <title>{`${bar.label}: ${formatCompactAmount(bar.value, currency)}`}</title>
              </rect>
              <text x={centerX} y={barTop - 6} textAnchor="middle" className="chart-value">
                {formatCompactAmount(bar.value, currency)}
              </text>
              <text x={centerX} y={CHART_HEIGHT - 8} textAnchor="middle" className="chart-label">
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
