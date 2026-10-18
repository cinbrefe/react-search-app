# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Movie search/discovery SPA: React 19 + Vite 8 + Sass, data from the TMDB v3 API, deployed on Vercel. No TypeScript, no router, no state library.

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # Production build to dist/
npm run lint     # ESLint (react, react-hooks, jsx-a11y)
npm run preview  # Serve the production build
npm test         # Vitest in watch mode
npx vitest run   # all tests once
npx vitest run path/to/file.test.js   # a single test file
```

Tests use Vitest + React Testing Library (jsdom), with MSW available for API mocks. Config is the `test` section of `vite.config.js` (only `src/**/*.test.{js,jsx}` is included) plus `src/test/setup.js` (jest-dom matchers, `cleanup` after each test). Test files sit next to the code they test. `.npmrc` sets `legacy-peer-deps=true`, so npm doesn't install peer dependencies: add them by hand (e.g. `@testing-library/dom`). Pure logic is easier to test in its own `.js` file, like `CardGrid/buildDiscoverParams.js`: exporting non-components from a `.jsx` file trips `react-refresh/only-export-components`.

## TMDB API key and the proxy

The browser never sees the TMDB key. All requests go to `/api/tmdb/*` (`API_BASE_URL` in `src/constants/api.js`), and the key gets attached on the server:

- **Production:** `api/[...path].js` is a Vercel function. `vercel.json` rewrites `/api/(.*)` to it. It parses the TMDB sub-path from `req.url` (not `req.query.path`, which is empty after a rewrite), forwards the query params and adds `api_key` from `process.env.TMDB_API_KEY`.
- **Local dev:** `vite.config.js` has a dev-server proxy that does the same job, reading `TMDB_API_KEY` with `loadEnv`. `api/` doesn't run under `npm run dev`.

Keep these two in sync when changing how requests are proxied. The key must never get a `VITE_` prefix, because Vite inlines those into the bundle.

**Security headers** (CSP, `X-Content-Type-Options`, `Referrer-Policy`) are set in `vercel.json` as the first `routes` entry with `"continue": true`. Vercel rejects a top-level `headers` key alongside `routes`. The CSP only allows the site itself, images from `https://image.tmdb.org` and `data:` images (the dropdown arrow, small assets Vite inlines). Any new external resource (fonts, analytics, embeds, another image host) must be added to the CSP or it silently fails in production. `npm run dev` doesn't apply these headers, so test CSP changes on a Vercel preview from a branch.

If dev shows **401s from `/api/tmdb`**, `.env.local` probably has `TMDB_API_KEY=""`. `vercel env pull` writes Sensitive vars as empty strings, and `.env.local` overrides `.env`. Delete that line and restart the dev server.

## Architecture

- **State:** `useAppState` (`src/hooks/`) holds all top-level state: `query`, `filters`, `selectedId`. `App.jsx` passes it down as props. `FilterSidebar` keeps a local copy of the filters and pushes every change up with `onFilter`.
- **Fetching:** every request goes through `useFetch(url)`, which uses a reducer for `{ data, loading, error }` and cancels in-flight requests with `AbortController`. Pass `null` to skip the fetch.
- **Two TMDB endpoints:** `CardGrid` calls `/search/movie` when there is a text query and `/discover/movie` (`buildDiscoverParams`) otherwise. TMDB can't combine a text search with filters, so the filter `<fieldset>` and the sort dropdown are disabled while a query is active. Rating sort and rating filter add `vote_count.gte` to keep obscure titles out; release-date sort is limited to films released by today with at least 10 votes. Pagination stops at page 500 (TMDB's limit).
- **Resetting pagination:** `App.jsx` sets `key={query + JSON.stringify(filters)}` on `CardGrid`. Every new query or filter remounts it, which resets `currentPage` to 1. Keep this in mind before adding state to `CardGrid`.
- **Modal:** uses the native `<dialog>` with `showModal()`, rendered through `createPortal` into `#modal` in `index.html`. It closes with the close button, Escape or a click on the backdrop; all three close the dialog natively, and its `close` event (`onClose`) is the only thing that updates React state. Don't rely on `cancel`: browsers skip it on some Escape presses. Don't set `position` on `.modal`: an open modal dialog must keep the browser's `position: fixed`, or it scrolls with the page and opens offscreen on mobile.
- **Accordion:** can be controlled or uncontrolled. `FilterSidebar` lets each accordion manage itself on desktop (all open) and controls them on mobile (one open at a time), using an `isMobile` value tied to window resize.
- **Components:** `components/features/` holds domain components (Card, CardDetails, CardGrid), `layout/` holds page sections, `ui/` holds reusable primitives. Each component folder contains its `.jsx` and its own `.scss`, and the component imports its stylesheet.

## Conventions

- Import with the `@/` alias (it points to `src/`). Use tabs, no semicolons (ESLint enforces `semi: never`), and single quotes, including JSX attributes.
- Components are `export default function Name(...)` with a `// Props:` comment block at the top. Hooks document `// Params:` and `// Returns:` the same way.
- **SCSS:** mobile-first BEM, with one root block per component (`.card`, `.card__image`, `.pagination__btn--active`). Don't nest elements (`.block__a__b`); write `.block__b`. Skeletons get their own blocks (`.card-skeleton`). Properties are sorted alphabetically.
  - Component styles start with `@use '@/styles/abstracts/variables' as *;` and `mixins`. Use the tokens (`$spacing-*`, `$color-*`, `$font-size-*`) and mixins (`respond-to(md)`, `mobile-only`, `flex(...)`, `icon(size)`, `shimmer`, `truncate`). `STYLES.md` lists every one.
  - Size Lucide icons with the `icon()` mixin on a wrapper class, not the `size` prop.
- **TMDB attribution is required by TMDB's terms:** keep the TMDB logo in `Header` and the disclaimer in `Footer` ("This product uses the TMDB API but is not endorsed or certified by TMDB."). Don't remove or reword them.
- **Accessibility** is a project goal. Use semantic elements and labelled controls, put `role="status"` on dynamic messages, and use `.visually-hidden` for text only screen readers need. `WCAG2-REPORT.md` tracks open WCAG 2.1 AA issues; update it when you fix one.

## Agents

Three project subagents live in `.claude/agents/` (see `.claude/README.md`): `accessibility-expert` (fixes WCAG issues, edits code), `frontend-mentor` (teaches and reviews; guides the user through Vitest + React Testing Library rather than doing the work), and `performance-seo-auditor` (report-only). None of them commit.
