import { formatStatementValue } from "@/lib/format";
import { metricValue } from "@/lib/metrics";
import { periodLabel } from "@/lib/periods";
import type { PeriodType, StatementMetric, StatementPeriod } from "@/lib/types";

interface StatementTableProps {
  metrics: StatementMetric[];
  /** Oldest first. */
  periods: StatementPeriod[];
  periodType: PeriodType;
  currency: string;
}

export function StatementTable({ metrics, periods, periodType, currency }: StatementTableProps) {
  return (
    <div className="table-scroll">
      <table className="statement">
        <caption>Income statement (USD in millions, except per-share values)</caption>
        <thead>
          <tr>
            <th scope="col">Line item</th>
            {periods.map((period) => (
              <th scope="col" key={period.periodId}>
                {periodLabel(period, periodType)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.standardizedMetricId} className={metric.isTotal ? "total-row" : undefined}>
              <th scope="row">{metric.metricName}</th>
              {periods.map((period) => (
                <td key={period.periodId}>
                  {formatStatementValue(metricValue(period, metric.standardizedMetricId), metric)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
