import type { StatementMetric } from "@/lib/types";

const MILLION = 1_000_000;
const MISSING = "—";

/** Statement cell: amounts and share counts in millions, per-share values in units with 2 decimals. */
export function formatStatementValue(value: number | null, metric: StatementMetric): string {
  if (value === null) return MISSING;
  const decimals = metric.metricFormat === "ratio" ? 2 : 0;
  const formatted = Math.abs(value / MILLION).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return value < 0 ? `(${formatted})` : formatted;
}

/** Large amounts in short form, e.g. "$331.8B". */
export function formatCompactAmount(value: number | null, currency: string): string {
  if (value === null) return MISSING;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPerShare(value: number | null, currency: string): string {
  if (value === null) return MISSING;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(value);
}

export function formatPercent(ratio: number | null): string {
  if (ratio === null) return MISSING;
  return `${(ratio * 100).toFixed(1)}%`;
}

/** Growth with an explicit sign, e.g. "+12.3%" or "-4.0%". */
export function formatGrowth(ratio: number | null): string {
  if (ratio === null) return MISSING;
  return ratio > 0 ? `+${formatPercent(ratio)}` : formatPercent(ratio);
}
