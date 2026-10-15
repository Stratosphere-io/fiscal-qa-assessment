export type PeriodType = "annual" | "quarterly";

export type StatementType = "income-statement" | "cash-flow-statement";

export interface CompanySummary {
  companyKey: string;
  name: string;
  ticker: string;
  exchange: string;
}

export interface CompanyProfile {
  companyKey: string;
  displayNameEnglish: string;
  descriptionShort?: string | null;
  sector?: string | null;
  industry?: string | null;
  reportingCurrency?: string | null;
  primaryListing?: {
    ticker: string;
    exchangeCode: string;
    exchangeName?: string | null;
  } | null;
}

export interface StatementMetric {
  standardizedMetricId: string;
  metricName: string;
  /** "number" for amounts and share counts, "ratio" for per-share values. */
  metricFormat: string;
  isCurrency: boolean;
  isTotal: boolean;
}

export interface MetricValue {
  value: number | null;
  currency?: string;
}

export interface StatementPeriod {
  periodId: string;
  periodType: string;
  /** Last day of the period, YYYY-MM-DD. */
  reportDate: string;
  calendarYear: number;
  calendarQuarter: number;
  fiscalYear: number;
  fiscalQuarter: number;
  metricsValues: Record<string, MetricValue | undefined>;
}

export interface FinancialStatement {
  reportingTemplate: string;
  metrics: StatementMetric[];
  /** Newest period first, as the API returns it. */
  data: StatementPeriod[];
}
