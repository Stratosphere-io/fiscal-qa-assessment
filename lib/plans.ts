export type Plan = "free" | "pro";

export const PLAN_COOKIE = "plan";

export const PLANS: { plan: Plan; label: string }[] = [
  { plan: "free", label: "Free" },
  { plan: "pro", label: "Pro" },
];

export function parsePlan(value: string | undefined): Plan {
  return value === "pro" ? "pro" : "free";
}

/** The plan stored in a cookie string such as `document.cookie`. */
export function planFromCookies(cookies: string): Plan {
  const planCookie = cookies.split("; ").find((cookie) => cookie.startsWith(`${PLAN_COOKIE}=`));
  return parsePlan(planCookie?.slice(PLAN_COOKIE.length + 1));
}
