"use client";

import { useRouter } from "next/navigation";
import { type FocusEvent, type FormEvent, useState } from "react";
import { LoadingLink } from "@/components/LoadingLink";
import { usePageLoading } from "@/components/PageLoading";
import { filterCompanies } from "@/lib/companies";
import type { CompanySummary, PeriodType } from "@/lib/types";

const RESULTS_ID = "company-search-results";

interface CompanySearchProps {
  companies: CompanySummary[];
  selectedCompanyKey: string;
  period?: PeriodType;
}

export function CompanySearch({ companies, selectedCompanyKey, period }: CompanySearchProps) {
  const router = useRouter();
  const { loadPage } = usePageLoading();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const matches = filterCompanies(companies, query);

  const companyHref = (companyKey: string) => {
    const path = `/company/${encodeURIComponent(companyKey)}`;
    return period ? `${path}?period=${period}` : path;
  };

  // Enter opens the first company in the list.
  function openFirstMatch(event: FormEvent) {
    event.preventDefault();
    setIsOpen(false);
    const [firstMatch] = companies;
    if (firstMatch) loadPage(() => router.push(companyHref(firstMatch.companyKey)));
  }

  function closeWhenFocusLeaves(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  }

  return (
    <form
      className="company-search"
      role="search"
      onSubmit={openFirstMatch}
      onBlur={closeWhenFocusLeaves}
      onKeyDown={(event) => event.key === "Escape" && setIsOpen(false)}
    >
      <label htmlFor="company-search-input">Search companies</label>
      <input
        id="company-search-input"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={RESULTS_ID}
        placeholder="Name or ticker"
        value={query}
        onClick={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        autoComplete="off"
      />
      {isOpen && (
        // Keeps focus in the search box while a result is clicked, so the list does not close first.
        <div id={RESULTS_ID} className="company-dropdown" onMouseDown={(event) => event.preventDefault()}>
          {matches.length === 0 ? (
            <p className="muted">No companies match “{query}”.</p>
          ) : (
            <ul className="company-list" aria-label="Search results">
              {matches.map((company) => (
                <li key={company.companyKey}>
                  <LoadingLink
                    href={companyHref(company.companyKey)}
                    replace
                    aria-current={company.companyKey === selectedCompanyKey ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{company.name}</span>
                    <span className="muted">{company.ticker}</span>
                  </LoadingLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
