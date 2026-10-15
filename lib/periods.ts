import type { PeriodType, StatementPeriod } from "@/lib/types";

export const PERIODS_SHOWN = 8;

export function parsePeriodType(value: string | string[] | undefined): PeriodType {
  return value === "quarterly" ? "quarterly" : "annual";
}

export function sortOldestFirst(periods: StatementPeriod[]): StatementPeriod[] {
  return [...periods].sort((first, second) => first.reportDate.localeCompare(second.reportDate));
}

/** The most recent periods, oldest first. */
export function recentPeriods(periods: StatementPeriod[]): StatementPeriod[] {
  return sortOldestFirst(periods).slice(-PERIODS_SHOWN);
}

/** "FY2026" for annual periods, "Q1 FY2026" for quarters. */
export function periodLabel(period: StatementPeriod, periodType: PeriodType): string {
  if (periodType === "annual") return `FY${period.fiscalYear}`;
  return `Q${period.fiscalQuarter} FY${period.fiscalYear}`;
}
