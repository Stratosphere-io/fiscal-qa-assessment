"use client";

import { useRouter } from "next/navigation";
import { usePageLoading } from "@/components/PageLoading";
import { PLAN_COOKIE, PLANS, type Plan, planFromCookies } from "@/lib/plans";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function PlanSwitcher() {
  const router = useRouter();
  const { loadPage } = usePageLoading();
  const plan = typeof document === "undefined" ? "free" : planFromCookies(document.cookie);

  function choosePlan(nextPlan: Plan) {
    document.cookie = `${PLAN_COOKIE}=${nextPlan}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
    loadPage(() => router.refresh());
  }

  return (
    <div className="plan-switcher" role="group" aria-label="Plan">
      <span className="muted">Plan</span>
      {PLANS.map((option) => (
        <button
          key={option.plan}
          type="button"
          aria-pressed={option.plan === plan}
          onClick={() => choosePlan(option.plan)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
