import { redirect } from "next/navigation";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FiscalApiError, getCompanies } from "@/lib/fiscalApi";
import type { CompanySummary } from "@/lib/types";

// Render on every request: a build without the API key must not bake an error page into `/`.
export const dynamic = "force-dynamic";

// The app opens on the first company in the list.
export default async function HomePage() {
  let firstCompany: CompanySummary | undefined;
  try {
    [firstCompany] = await getCompanies();
  } catch (error) {
    if (error instanceof FiscalApiError) return <ErrorMessage message={error.message} />;
    throw error;
  }
  if (!firstCompany) return <ErrorMessage message="No companies are available for this API key." />;
  redirect(`/company/${encodeURIComponent(firstCompany.companyKey)}`);
}
