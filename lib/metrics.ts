import type { StatementPeriod } from "@/lib/types";

// Banks and insurers use a different statement layout with its own revenue line.
const REVENUE_METRIC_IDS = [
  "income_statement_total_revenues",
  "income_statement_total_revenues_before_provision_for_credit_losses",
];

export const METRIC_IDS = {
  grossProfit: "income_statement_gross_profit",
  operatingProfit: "income_statement_operating_profit",
  netIncome: "income_statement_net_income_attributable_to_common_shareholders",
  dilutedEps: "income_statement_diluted_eps",
  operatingCashFlow: "cash_flow_statement_cash_from_operating_activities",
  capitalExpenditure: "cash_flow_statement_purchases_of_property_plant_and_equipment",
};

const QUARTERS_PER_YEAR = 4;

export function metricValue(period: StatementPeriod, metricId: string): number | null {
  return period.metricsValues[metricId]?.value ?? null;
}

export function revenue(period: StatementPeriod): number | null {
  for (const metricId of REVENUE_METRIC_IDS) {
    const value = metricValue(period, metricId);
    if (value !== null) return value;
  }
  return null;
}

/** numerator / denominator, or null when either side is missing. */
export function margin(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || !denominator) return null;
  return numerator / denominator;
}

const MARGIN_LINES = [
  { label: "Gross margin", metricId: METRIC_IDS.grossProfit },
  { label: "Operating margin", metricId: METRIC_IDS.operatingProfit },
  { label: "Net margin", metricId: METRIC_IDS.netIncome },
];

/** Gross, operating and net margin of one period. */
export function margins(period: StatementPeriod): { label: string; value: number | null }[] {
  const periodRevenue = revenue(period);
  return MARGIN_LINES.map((line) => ({
    label: line.label,
    value: margin(metricValue(period, line.metricId), periodRevenue),
  }));
}

/** Free cash flow: operating cash flow minus capital expenditure. */
export function freeCashFlow(period: StatementPeriod): number | null {
  const operatingCashFlow = metricValue(period, METRIC_IDS.operatingCashFlow);
  const capitalExpenditure = metricValue(period, METRIC_IDS.capitalExpenditure);
  if (operatingCashFlow === null || capitalExpenditure === null) return null;
  return operatingCashFlow - capitalExpenditure;
}

/** Revenue growth of the latest period versus the same period one year earlier. `periods` are oldest first. */
export function revenueGrowth(periods: StatementPeriod[]): number | null {
  const latest = periods.at(-1);
  if (!latest) return null;
  const yearEarlier = periods.find(
    (period) => period.fiscalYear === latest.fiscalYear - 1 && period.fiscalQuarter === latest.fiscalQuarter,
  );
  if (!yearEarlier) return null;

  const latestRevenue = revenue(latest);
  const yearEarlierRevenue = revenue(yearEarlier);
  if (latestRevenue === null || !yearEarlierRevenue) return null;
  return (latestRevenue - yearEarlierRevenue) / Math.abs(yearEarlierRevenue);
}

/** Revenue over the last twelve months: the sum of the four latest quarters. `quarters` are oldest first. */
export function lastTwelveMonthsRevenue(quarters: StatementPeriod[]): number | null {
  if (quarters.length < QUARTERS_PER_YEAR) return null;

  let total = 0;
  for (let index = quarters.length - 1; index > quarters.length - QUARTERS_PER_YEAR; index--) {
    const quarterRevenue = revenue(quarters[index]);
    if (quarterRevenue === null) return null;
    total += quarterRevenue;
  }
  return total;
}
