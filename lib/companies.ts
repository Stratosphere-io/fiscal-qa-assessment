import type { CompanySummary } from "@/lib/types";

export const COMPANY_KEYS = ["NASDAQ_MSFT", "NASDAQ_NVDA", "NASDAQ_AMZN", "NYSE_JPM", "NASDAQ_ASML"];

export function filterCompanies(companies: CompanySummary[], query: string): CompanySummary[] {
  const searchText = query.trim().toLowerCase();
  if (!searchText) return companies;
  return companies.filter(
    (company) => company.name.toLowerCase().includes(searchText) || company.ticker.toLowerCase().includes(searchText),
  );
}
