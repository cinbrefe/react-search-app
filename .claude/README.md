# Custom Agents

Custom [Claude Code subagents](https://docs.claude.com/en/docs/claude-code/sub-agents) for this project live in [`.claude/agents/`](agents/). Each `.md` file defines a specialist agent with a focused role, a specific set of tools, and tailored instructions.

---

## `a11y-playwright` — Accessibility Testing Agent

A specialist agent for writing and running [Playwright](https://playwright.dev/) accessibility tests targeting **WCAG 2.1 AA** compliance. It uses [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) for automated scanning and adds targeted manual checks for issues axe can't detect.

### How to invoke

Claude Code delegates to it automatically when a task matches its description. To invoke it explicitly, @-mention it or ask for it by name:

```
@agent-a11y-playwright <your task>
```

```
Use the a11y-playwright agent to <your task>
```

Run `/agents` to view or edit it.

### Example prompts

| Task | Prompt |
|---|---|
| Write a test for a specific open issue | `@agent-a11y-playwright Write a test for the skip link focus styling (ISSUE-05)` |
| Run an axe scan on a component | `@agent-a11y-playwright Run axe-core scan on the FilterSidebar` |
| Test keyboard navigation | `@agent-a11y-playwright Write keyboard navigation tests for the Modal` |
| Run all accessibility tests | `@agent-a11y-playwright Run all a11y tests and update WCAG2-REPORT.md with results` |
| Verify a fix you just made | `@agent-a11y-playwright Check if ISSUE-01 is fixed after the RatingFilter change` |

### What it does

1. **Checks dependencies** — auto-installs `@playwright/test` and `@axe-core/playwright` if missing
2. **Reads the codebase** — inspects the relevant component source and `WCAG2-REPORT.md` before writing any test
3. **Writes tests** — creates or updates files in `tests/`, one `test.describe` per component or issue
4. **Runs tests** — executes `npx playwright test` against Chromium
5. **Maps results** — ties failures to specific WCAG 2.1 success criteria
6. **Updates the report** — marks issues in `WCAG2-REPORT.md` as verified-failing or verified-passing

### What it will NOT do

- Modify application source files (`src/`) — test files only
- Start the dev server — you must run `npm run dev` yourself before testing locally
- Fix functional (non-accessibility) bugs

### Prerequisites

Before running tests the agent will verify these are installed; if not, it installs them automatically:

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install chromium
```

The dev server must be running on `http://localhost:5173` for local test runs:

```bash
npm run dev
```

### Running tests manually

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/a11y.spec.js --reporter=list

# Open the HTML report after a run
npx playwright show-report
```

### Open issues tracked

The agent is pre-loaded with the issues from [`WCAG2-REPORT.md`](../WCAG2-REPORT.md):

| ID | Component | Issue |
|---|---|---|
| ISSUE-01 | `RatingFilter` | Checkboxes used for single-select (should be radio buttons) |
| ISSUE-02 | `CardDetails` | `<dt>` labels hidden on mobile with `display:none` |
| ISSUE-03/04 | Inputs, Dropdowns, Buttons | Missing `:focus-visible` styles |
| ISSUE-05 | Skip link | No visible focus styling |
| ISSUE-06 | `CardDetails` | "Overview" is a `<p>` not a heading |
| ISSUE-07 | `CardGrid` | No `aria-live` announcement on result updates |
| ISSUE-08/09 | Skeletons | Missing `aria-busy` / `aria-hidden` |
| ISSUE-11 | `YearRangeFilter` | No inline validation error messages |
