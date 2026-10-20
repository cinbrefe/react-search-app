# Custom Agents

[Claude Code subagents](https://docs.claude.com/en/docs/claude-code/sub-agents) for this project live in [`agents/`](agents/). Each one is a specialist with its own instructions and tools.

Claude Code hands a task to the right agent automatically when it matches the agent's description. To call one yourself, @-mention it or ask for it by name:

```
@agent-frontend-mentor teach me to test Pagination
```

```
Use the accessibility-expert agent to fix ISSUE-03
```

Run `/agents` to see or edit them. New or changed agents load when Claude Code starts, so restart it after editing these files.

None of the agents commit. You review every commit.

---

## `accessibility-expert`

Audits and fixes WCAG 2.1 AA issues, and keeps [`WCAG2-REPORT.md`](../WCAG2-REPORT.md) up to date. It can edit application code.

| Task | Prompt |
|---|---|
| Fix a known issue | `@agent-accessibility-expert Fix ISSUE-01 in RatingFilter` |
| Audit a component | `@agent-accessibility-expert Audit the Modal for keyboard and screen reader issues` |
| Check a fix you made | `@agent-accessibility-expert Check whether ISSUE-05 is fixed` |
| Find new issues | `@agent-accessibility-expert Audit the whole app and add new issues to the report` |

It runs `npm run lint` and `npm run build` after each change. Once tests are set up, it also writes a test for each fix. It finishes with a list of manual checks (keyboard, VoiceOver, zoom).

## `frontend-mentor`

Teaches rather than does. It explains how the code works, reviews your code, and guides you through testing with Vitest and React Testing Library. It writes code only when you ask it to.

| Task | Prompt |
|---|---|
| Understand a pattern | `@agent-frontend-mentor Why does CardGrid use a key prop?` |
| Start learning to test | `@agent-frontend-mentor Help me set up Vitest and write my first test` |
| Next lesson | `@agent-frontend-mentor What should I test next?` |
| Code review | `@agent-frontend-mentor Review my changes to useFetch` |
| Interview prep | `@agent-frontend-mentor Quiz me on the decisions in this project` |

Its testing lessons, in order:
1. `buildDiscoverParams`
2. `Pagination`
3. form controls
4. `useFetch` with mocked API calls (MSW)
5. a full search-and-modal flow
6. a regression test for the sort bug
7. accessibility checks in tests

## `performance-seo-auditor`

Audits performance (Core Web Vitals, bundle size, fonts, images, caching) and SEO (meta tags, Open Graph, robots.txt, how crawlers see the app). It only reports; it doesn't edit files.

| Task | Prompt |
|---|---|
| Full audit | `@agent-performance-seo-auditor Audit performance and SEO` |
| One area | `@agent-performance-seo-auditor How can I make the fonts load faster?` |
| Before sharing the site | `@agent-performance-seo-auditor Check how the site looks when shared on LinkedIn` |

It builds the app to measure asset sizes, checks the live site's headers, and runs Lighthouse if Chrome is available. Findings come back ranked by impact and effort, with the top 3 fixes spelled out.

## `qa-engineer`

Plans tests, hunts for bugs, runs the suite, and reviews the tests you write. It doesn't write tests or change code unless you ask, so you keep practising.

| Task | Prompt |
|---|---|
| Review your tests | `@agent-qa-engineer Review my tests in App.test.jsx` |
| Find gaps | `@agent-qa-engineer What important behaviour is still untested?` |
| Test plan | `@agent-qa-engineer Write a test plan for the year range filter` |
| Bug hunt | `@agent-qa-engineer Hunt for bugs in the search and filter interaction` |
| Manual checklist | `@agent-qa-engineer Give me a manual checklist before I share the site` |

Bug reports come with steps to reproduce, expected and actual results, severity, and the file involved. It also flags what can't be tested in jsdom (layout, the real `<dialog>`, scrolling, security headers) as manual checks or future Playwright tests.
