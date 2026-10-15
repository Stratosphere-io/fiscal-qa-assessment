import { formatCompactAmount, formatGrowth, formatPercent, formatPerShare } from "@/lib/format";
import {
  freeCashFlow,
  lastTwelveMonthsRevenue,
  METRIC_IDS,
  margins,
  metricValue,
  revenue,
  revenueGrowth,
} from "@/lib/metrics";
import { periodLabel } from "@/lib/periods";
import type { PeriodType, StatementPeriod } from "@/lib/types";

interface SummaryCardsProps {
  /** All income statement periods of the selected type, oldest first. */
  periods: StatementPeriod[];
  /** All income statement quarters, oldest first. */
  quarters: StatementPeriod[];
  /** Cash flow statement periods of the selected type, in any order. */
  cashFlowPeriods: StatementPeriod[];
  periodType: PeriodType;
  currency: string;
}

interface Card {
  label: string;
  value: string;
  detail?: { text: string; className: string };
}

export function SummaryCards({ periods, quarters, cashFlowPeriods, periodType, currency }: SummaryCardsProps) {
  const latest = periods.at(-1);
  if (!latest) return <p className="muted">No financial periods are available for this company.</p>;

  const growth = revenueGrowth(periods);
  const latestCashFlow = cashFlowPeriods.find((period) => period.reportDate === latest.reportDate);
  const cards: Card[] = [
    {
      label: `Revenue (${periodLabel(latest, periodType)})`,
      value: formatCompactAmount(revenue(latest), currency),
      detail: {
        text: `${formatGrowth(growth)} year over year`,
        className: growth !== null && growth < 0 ? "negative" : "positive",
      },
    },
    { label: "Revenue (last twelve months)", value: formatCompactAmount(lastTwelveMonthsRevenue(quarters), currency) },
    ...margins(latest).map((line) => ({ label: line.label, value: formatPercent(line.value) })),
    { label: "Diluted EPS", value: formatPerShare(metricValue(latest, METRIC_IDS.dilutedEps), currency) },
    {
      label: "Operating cash flow",
      value: formatCompactAmount(
        latestCashFlow ? metricValue(latestCashFlow, METRIC_IDS.operatingCashFlow) : null,
        currency,
      ),
    },
    {
      label: "Free cash flow",
      value: formatCompactAmount(latestCashFlow ? freeCashFlow(latestCashFlow) : null, currency),
    },
  ];

  return (
    <dl className="summary-cards" aria-label="Key figures">
      {cards.map((card) => (
        <div className="panel" key={card.label}>
          <dt>{card.label}</dt>
          <dd>{card.value}</dd>
          {card.detail && <dd className={`detail ${card.detail.className}`}>{card.detail.text}</dd>}
        </div>
      ))}
    </dl>
  );
}
