# Inbound reports

These came in this week. They are not a complete list of what is wrong with the app. Reproduce each one and decide
whether it is a bug. If it is, handle it like any other bug
(report, test, fix). If it is not, say why in `TEST_PLAN.md`.

---

## R1 — Customer email

> Your "last twelve months" revenue for Microsoft doesn't match what I get when I add up their last four quarterly
> reports. Which number is right?

## R2 — Customer chat

> I'm based in the US but ASML's page shows everything in euros. Can you make it show dollars?

## R3 — Message from Sales

> A prospect on the Free plan sent us a screenshot of Microsoft's quarterly numbers from the viewer. I thought
> quarterly was Pro only? Not sure how they got it.

## R4 — Error monitoring alert

> **TypeError: periods is not iterable**
>
> ```
> at sortOldestFirst (lib/periods.ts:10)
> at recentPeriods (lib/periods.ts:15)
> at CompanyPage (app/company/[companyKey]/page.tsx)
> ```
>
> 23 events this week, all on `/company/...` pages. Users see a blank error page. Most events follow a visit to a
> company that does not exist, such as `/company/NASDAQ_MSTF`.
