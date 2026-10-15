import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanySearch } from "@/components/CompanySearch";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PeriodToggle } from "@/components/PeriodToggle";
import { RevenueChart } from "@/components/RevenueChart";
import { StatementTable } from "@/components/StatementTable";
import { SummaryCards } from "@/components/SummaryCards";
import { currentPlan } from "@/lib/currentPlan";
import { FiscalApiError, getCompanies, getCompanyProfile, getStatement } from "@/lib/fiscalApi";
import { parsePeriodType, recentPeriods, sortOldestFirst } from "@/lib/periods";

interface CompanyPageProps {
  params: Promise<{ companyKey: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { companyKey } = await params;
  const periodType = parsePeriodType((await searchParams).period);
  const plan = await currentPlan();

  try {
    const [companies, profile, annualIncomeStatement, quarterlyIncomeStatement, cashFlowStatement] = await Promise.all([
      getCompanies(),
      getCompanyProfile(companyKey),
      getStatement({ companyKey, statementType: "income-statement", periodType: "annual" }),
      getStatement({ companyKey, statementType: "income-statement", periodType: "quarterly" }),
      getStatement({ companyKey, statementType: "cash-flow-statement", periodType }),
    ]);
    const incomeStatement = periodType === "annual" ? annualIncomeStatement : quarterlyIncomeStatement;
    const currency = profile.reportingCurrency ?? "USD";
    const shownPeriods = recentPeriods(incomeStatement.data);

    return (
      <div className="company-view">
        <CompanySearch companies={companies} selectedCompanyKey={companyKey} />
        <div className="company-heading">
          <CompanyHeader profile={profile} />
          <PeriodToggle companyKey={companyKey} periodType={periodType} plan={plan} />
        </div>
        <SummaryCards
          periods={sortOldestFirst(incomeStatement.data)}
          quarters={sortOldestFirst(quarterlyIncomeStatement.data)}
          cashFlowPeriods={cashFlowStatement.data}
          periodType={periodType}
          currency={currency}
        />
        <RevenueChart periods={shownPeriods} periodType={periodType} currency={currency} />
        <StatementTable
          metrics={incomeStatement.metrics}
          periods={shownPeriods}
          periodType={periodType}
          currency={currency}
        />
      </div>
    );
  } catch (error) {
    if (error instanceof FiscalApiError) return <ErrorMessage message={error.message} />;
    throw error;
  }
}
