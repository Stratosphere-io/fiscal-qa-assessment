// The API key must never reach the browser: importing this module from a client component fails the build.
import "server-only";
import { COMPANY_KEYS } from "@/lib/companies";
import type { CompanyProfile, CompanySummary, FinancialStatement, PeriodType, StatementType } from "@/lib/types";

const DEFAULT_BASE_URL = "https://api.fiscal.ai";
const PLACEHOLDER_API_KEY = "your-api-key-here";
const CACHE_TTL_MS = 60 * 60 * 1000;

// Responses are cached in memory so repeated page loads and test runs do not spend API quota.
const responseCache = new Map<string, { expiresAt: number; body: unknown }>();

export class FiscalApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

interface ApiErrorBody {
  errors?: { message?: string }[];
}

async function getJson<T>(path: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.FISCAL_API_KEY;
  if (!apiKey || apiKey === PLACEHOLDER_API_KEY) {
    throw new FiscalApiError("FISCAL_API_KEY is not set. Copy .env.example to .env.local and add your key.", 500);
  }

  const baseUrl = process.env.FISCAL_API_BASE_URL || DEFAULT_BASE_URL;
  const url = `${baseUrl}${path}?${new URLSearchParams(params)}`;
  const cached = responseCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.body as T;

  const response = await fetch(url, {
    headers: { "X-Api-Key": apiKey, "User-Agent": "fiscal-qa-take-home" },
    cache: "no-store",
  });
  const body: unknown = await response.json().catch(() => null);
  responseCache.set(url, { expiresAt: Date.now() + CACHE_TTL_MS, body });

  if (!response.ok) {
    const message = (body as ApiErrorBody | null)?.errors?.[0]?.message;
    throw new FiscalApiError(message ?? `Request failed with status ${response.status}`, response.status);
  }
  return body as T;
}

export function getCompanyProfile(companyKey: string): Promise<CompanyProfile> {
  return getJson<CompanyProfile>("/v3/company/profile", { companyKey });
}

/** The companies the app covers, in list order. */
export async function getCompanies(): Promise<CompanySummary[]> {
  const profiles = await Promise.all(COMPANY_KEYS.map(getCompanyProfile));
  return profiles.map((profile) => ({
    companyKey: profile.companyKey,
    name: profile.displayNameEnglish,
    ticker: profile.primaryListing?.ticker ?? profile.companyKey,
    exchange: profile.primaryListing?.exchangeCode ?? "",
  }));
}

interface StatementRequest {
  companyKey: string;
  statementType: StatementType;
  periodType: PeriodType;
}

export function getStatement({ companyKey, statementType, periodType }: StatementRequest): Promise<FinancialStatement> {
  return getJson<FinancialStatement>(`/v1/company/financials/${statementType}/standardized`, {
    companyKey,
    periodType,
  });
}
