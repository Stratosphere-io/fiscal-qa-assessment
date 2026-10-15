import "server-only";
import { cookies } from "next/headers";
import { PLAN_COOKIE, type Plan, parsePlan } from "@/lib/plans";

/** The visitor's plan, chosen with the plan switcher in the header. There is no real sign-in in this app. */
export async function currentPlan(): Promise<Plan> {
  return parsePlan((await cookies()).get(PLAN_COOKIE)?.value);
}
