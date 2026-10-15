# Financials Viewer — Product Quality Engineering Take-Home

Financials Viewer is a small Next.js app that shows public companies' income statements and key figures, using data
from the [Fiscal.ai API](https://docs.fiscal.ai). It was built quickly, it has no tests, and it has bugs.

This is an engineering exercise. Treat the app as something you own: find what is wrong, trace each problem to its
root cause, fix it, and add the tests and CI that stop it from coming back.

We do not expect you to find everything; deciding what to work on first is part of the exercise. Tell us in
`TEST_PLAN.md` roughly how long you spent.

## What you will hand in

- [ ] `BUGS.md`: one report per bug, including its root cause (template in that file)
- [ ] For each bug: an automated test that fails because of the bug, and a fix that makes it pass
- [ ] Your test setup: the tools you chose, configured, with `package.json` scripts that run your tests (see step 4)
- [ ] A GitHub Actions workflow that runs the type check and your unit tests on every push
- [ ] `TEST_PLAN.md`: a short note on how you worked and what you would do next (see step 7 below)
- [ ] All of it in a **private** repository shared with us (see [Submitting](#submitting))

## Setup

You need [Node.js](https://nodejs.org) 20.9 or newer (22 recommended) and git.

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create your local settings file:

   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and replace `your-api-key-here` with the API key from your assignment email.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000. You should see Microsoft's figures. Click the search box at the top to switch company.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the app on http://localhost:3000 |
| `npm run typecheck` | Checks the TypeScript types |

### If something goes wrong

| You see | Do this |
| --- | --- |
| "This company is not available…" | The app covers the five companies in its list. Pick one from there |

### About the API key

The key is for this assignment only. Do not commit it, share it, put it in CI, or use it for anything else. Run the
app on your own machine only: do not deploy it or share its address, because it calls the API with your key on the
server. The app caches API responses in memory for an hour; restart `npm run dev` to fetch fresh data.

## How the app should behave

This is the specification. Anything the app does that differs from it is a bug.

### Plans

- The header has a **Plan** switch (Free / Pro). There is no real sign-in in this app; the switch stands in for the
  signed-in user's subscription.
- Quarterly figures are only available on Pro. Free users must not be able to see them.
- On Free, the Quarterly option is shown locked, with a Pro badge.
- The Plan switch always shows the current plan, including after a page reload.

### Company list

- The app covers five companies: Microsoft, NVIDIA, Amazon, JPMorgan Chase and ASML. Opening any other company in the
  URL, real or not, shows "This company is not available in Financials Viewer." instead of its figures.
- Opening the app (`/`) shows the first company in the list.
- The company list is closed until you click the search box. It shows the five companies, with the selected company
  highlighted, and closes when you pick a company, press Escape or click elsewhere.
- The search box filters the list as you type. It matches any part of the company name or ticker and ignores
  upper/lower case. Pressing Enter opens the first company in the filtered list.
- The browser's Back button returns to the company you were looking at before.

### Company page (`/company/{companyKey}`)

- Shows the company name, listing, sector and short description.
- **Annual / Quarterly** switches between annual and quarterly figures. The choice is kept in the URL
  (`?period=quarterly`), and it is kept when you switch to another company from the company list.
- Shows the latest 8 periods of the selected type.
- While new figures load (another company, period or plan), the current page stays where it is, dimmed, with a
  spinner over it; nothing on the page moves until the new figures appear.
- Annual periods are labelled by fiscal year (`FY2026`). Quarters are labelled by the company's own fiscal quarter
  and fiscal year (`Q1 FY2026`). For some companies the fiscal year does not follow the calendar year.

#### Key figures

All key figures describe the latest period of the selected type, except where noted.

| Figure | Definition |
| --- | --- |
| Revenue | Revenue of the latest period, with growth compared with the same period one year earlier (for quarters: the same fiscal quarter of the previous fiscal year) |
| Revenue (last twelve months) | Sum of the four most recent quarters' revenue, on both plans and in both views |
| Gross margin | Gross profit ÷ revenue |
| Operating margin | Operating profit ÷ revenue |
| Net margin | Net income attributable to common shareholders ÷ revenue |
| Diluted EPS | Diluted earnings per share |
| Operating cash flow | Cash from operating activities |
| Free cash flow | Operating cash flow minus capital expenditure |

A figure is shown as `—` when a line it needs has no value for that period: either the company does not report the
line, or it has not yet published that period's figures for it.

#### Revenue chart

Shows revenue for the same periods as the table, oldest on the left and newest on the right.

#### Income statement table

- One row per line item returned by the API, in the API's order; one column per period, oldest on the left.
- Amounts and share counts are in millions of the reporting currency, which the table's title names. Per-share
  values (EPS) are in currency units with two decimals.
- Negative values are shown in parentheses, e.g. `(1,646)`. Missing values are shown as `—`.
- When the table is wider than the screen, it scrolls sideways and the line-item column, including its header, stays
  in place.

### Errors

If the API returns an error, the page shows the error message instead of crashing.

## Your task

1. **Triage `REPORTS.md`.** These are reports from customers and colleagues. Reproduce each one and decide whether it
   is a bug. Not every report is, and the reports cover only a few of the app's problems.
2. **Find the rest yourself.** Explore the app and compare it with the specification. Try all five companies on both plans; they differ in
   fiscal year, industry and reporting currency. The figures come from company filings. If you think the data itself is wrong, you
   may report that too, but explain how you checked.
3. **Report each bug** in `BUGS.md`, including where the root cause is and why it happens.
4. **Set up testing and write a test for each bug** that fails because of the bug. The app has no test tools yet:
   choose and set up the ones you prefer, choose the level (unit or browser) that suits each bug, and add
   `package.json` scripts that run your tests.
5. **Fix the root cause**, not the symptom, so the test passes. Keep fixes small.
6. **Add CI.** Create a GitHub Actions workflow in `.github/workflows/` that installs dependencies, runs
   `npm run typecheck` and runs your unit tests on every push. Do not put the API key in CI. Running the browser
   tests in CI as well is a bonus: you will need a way to run them without the live API (the app reads its API
   address from `FISCAL_API_BASE_URL`).
7. **Write `TEST_PLAN.md`** (one page is plenty):
   - your triage of each report in `REPORTS.md`
   - what you tested and how, and what you would automate next
   - what you did not get to, and the risks you see
   - how your tests behave when the live data changes
   - how you used AI coding tools, if you did, and how you checked their output
   - roughly how long you spent

We care more about how you find root causes, how reliable your tests are and how clearly you explain your
reasoning than about the number of bugs you fix.

## Submitting

1. Clone this repository, then push it to a new **private** repository on your own GitHub account and work there.
   Do not fork it: forks of this repository are public, so other candidates could see your work.
2. Commit as you go. One commit per bug (test and fix together) is easiest to review.
3. Check that `.env.local` and your API key are not in any commit.
4. Invite the reviewers named in your assignment email and reply to that email with the link.

Questions about the assignment? Reply to the assignment email. Please do not open issues or pull requests on this
repository: other candidates can see them.

## Project layout

| Path | Contents |
| --- | --- |
| `app/` | Pages (Next.js App Router) |
| `components/` | UI components |
| `lib/` | API client, plans, calculations and formatting |
