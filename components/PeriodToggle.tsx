import { LoadingLink } from "@/components/LoadingLink";
import type { Plan } from "@/lib/plans";
import type { PeriodType } from "@/lib/types";

const OPTIONS: { periodType: PeriodType; label: string }[] = [
  { periodType: "annual", label: "Annual" },
  { periodType: "quarterly", label: "Quarterly" },
];

interface PeriodToggleProps {
  companyKey: string;
  periodType: PeriodType;
  plan: Plan;
}

export function PeriodToggle({ companyKey, periodType, plan }: PeriodToggleProps) {
  return (
    <nav className="period-toggle" aria-label="Period type">
      {OPTIONS.map((option) =>
        option.periodType === "quarterly" && plan === "free" ? (
          <span key={option.periodType} className="locked" aria-disabled="true" title="Quarterly figures are on Pro">
            {option.label} <span className="pro-badge">Pro</span>
          </span>
        ) : (
          <LoadingLink
            key={option.periodType}
            href={`/company/${encodeURIComponent(companyKey)}?period=${option.periodType}`}
            aria-current={option.periodType === periodType ? "page" : undefined}
          >
            {option.label}
          </LoadingLink>
        ),
      )}
    </nav>
  );
}
