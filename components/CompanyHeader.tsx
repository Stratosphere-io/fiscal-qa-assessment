import type { CompanyProfile } from "@/lib/types";

export function CompanyHeader({ profile }: { profile: CompanyProfile }) {
  const listing = profile.primaryListing;
  const details = [
    profile.sector,
    profile.industry,
    profile.reportingCurrency && `Reports in ${profile.reportingCurrency}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="company-header">
      <div className="company-title">
        <h1>{profile.displayNameEnglish}</h1>
        <span className="chip">{listing ? `${listing.exchangeCode}:${listing.ticker}` : profile.companyKey}</span>
      </div>
      {details && <p className="muted">{details}</p>}
      {profile.descriptionShort && <p className="description">{profile.descriptionShort}</p>}
    </section>
  );
}
