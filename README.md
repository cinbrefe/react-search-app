# Discover Movies

**Live demo:** [search.cindybrenes.dev](https://search.cindybrenes.dev/)

A responsive movie search and discovery app built with React 19 and the TMDB API. This project was built to demonstrate proficiency in modern React patterns, component architecture, mobile-first SCSS, and web accessibility.

Users can browse popular movies, search by title, filter by genre, rating, and year range, sort results, and view full movie details in a modal — all with skeleton loading states and accessible markup throughout.

## Features

- Search movies by title
- Browse popular movies
- Filter by genre, rating, and year range
- Sort by popularity, release date, or rating
- View movie details in a modal
- Skeleton loading states for cards and detail view
- Collapsible filter sidebar with accordion (mobile-friendly)
- Windowed pagination
- Fully responsive, mobile-first layout

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI library |
| [Sass](https://sass-lang.com/) | 1 | CSS preprocessor |
| [Vite](https://vitejs.dev/) | 8 | Build tool and dev server |
| [ESLint](https://eslint.org/) | 10 | Linting |
| [Lucide React](https://lucide.dev/) | 1 | Icon library |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | — | Self-hosted font |
| [TMDB API](https://developer.themoviedb.org/docs) | v3 | Movie data |

## Project Structure

```
api/
└── [...path].js              # Vercel serverless proxy that adds the TMDB key server-side
src/
├── assets/                   # Static assets (SVGs, images)
├── components/
│   ├── features/             # Domain-specific components
│   │   ├── Card/             # Movie card and skeleton
│   │   ├── CardDetails/      # Movie detail view and skeleton
│   │   └── CardGrid/         # Grid layout for cards
│   ├── layout/               # Page-level layout components
│   │   ├── FilterSidebar/    # Filter sidebar with genre, rating, year filters
│   │   ├── Footer/           # TMDB attribution
│   │   └── Header/           # Site header with logo and search
│   └── ui/                   # Reusable UI primitives
│       ├── Accordion/
│       ├── ErrorBoundary/
│       ├── Form/             # Checkbox, Dropdown, Input, Radio
│       ├── Modal/
│       ├── Pagination/
│       ├── Search/
│       └── SortBar/
├── constants/                # API config and filter definitions
├── hooks/                    # Custom React hooks (useFetch, useAppState)
└── styles/
    ├── abstracts/            # Variables, mixins, animations
    ├── base/                 # Reset, base, typography, utilities
    ├── layouts/              # App layout
    └── main.scss             # Entry point
```

## Installation

**Prerequisites:** Node.js 22.12 or newer (Vite 8 needs it; Vercel deploys with Node 24). Check yours with `node -v`.

1. Clone the repo
   ```bash
   git clone https://github.com/cinbrefe/react-search-app.git
   cd react-search-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your TMDB API key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```
   > The key uses no `VITE_` prefix — it is read only by the dev-server proxy and the Vercel serverless function, never bundled into client code. Also set this variable in your Vercel project's Environment Variables before deploying.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Deployment

The app is deployed on [Vercel](https://vercel.com/). Pushing to `main` deploys to production; other branches get preview deployments.

- Set `TMDB_API_KEY` in the Vercel project's Environment Variables. The serverless function in `api/` reads it, so the key never reaches the browser.
- `vercel.json` handles routing (`/api/*` goes to the proxy function, everything else to the app) and sets security headers, including a Content Security Policy. If you add an external resource such as fonts, analytics or another image host, add its domain to the CSP.

## Accessibility

This project follows WAI-ARIA best practices to ensure an inclusive experience for all users.

- **Skip link** — allows keyboard users to bypass the header and jump directly to main content
- **Semantic HTML** — uses native elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<dialog>`, `<fieldset>`, `<legend>`) for correct landmark structure
- **Keyboard navigation** — all interactive elements are reachable and operable via keyboard, with a visible `:focus-visible` outline
- **Screen reader announcements** — a persistent `role="status"` region announces result counts, empty results and errors after every search, filter or page change; loading skeletons are hidden from screen readers and the list is marked `aria-busy`
- **Reduced motion** — respects the `prefers-reduced-motion` setting: no skeleton shimmer, transitions, card zoom or smooth scrolling
- **Form validation** — invalid years show an inline error linked with `aria-describedby` and `aria-invalid`
- **Search form** — marked with `role="search"` so screen readers identify it as a search landmark
- **Modal** — uses native `<dialog>` element with `aria-modal`, `aria-label`, and `aria-describedby`; `Escape` key closes the modal
- **Accordion** — implements `aria-expanded` and `aria-controls` following the WAI-ARIA disclosure pattern
- **Pagination** — wrapped in `<nav aria-label="Pagination">`; each button has a descriptive `aria-label` and `aria-current="page"` for the active page
- **Card list** — uses a contextual `aria-label` that reflects search or browse state
- **Form controls** — all inputs, selects, checkboxes, and radio buttons have associated `<label>` elements via `htmlFor`/`id`
- **Filter groups** — grouped with `role="group"` and `aria-label`; the single-choice rating filter is a `role="radiogroup"` of radio buttons
- **Buttons** — all icon-only buttons have `aria-label` for screen reader context
- **Images** — decorative poster images use `alt=""` and `aria-hidden="true"` to avoid redundant announcements
- **Visually hidden content** — uses a `.visually-hidden` utility class for labels meaningful to screen readers but not needed visually

## Testing

Automated tests aren't set up yet. The planned stack is:

| Tool | Purpose |
|---|---|
| [Vitest](https://vitest.dev/) | Test runner, using the same config as Vite (including the `@/` alias) |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Renders components and finds elements the way a user would (by role, label, text) |
| [user-event](https://testing-library.com/docs/user-event/intro/) | Simulates clicks and typing |
| [jest-dom](https://github.com/testing-library/jest-dom) | Readable assertions such as `toBeDisabled()` and `toHaveAccessibleName()` |
| [MSW](https://mswjs.io/) | Mocks the TMDB API so tests don't hit the network |

Until then, check changes with `npm run lint` and `npm run build`. Accessibility issues and their status are tracked in [WCAG2-REPORT.md](WCAG2-REPORT.md).

## Linting

ESLint is configured with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y` for React best practices and accessibility checks.

## Credits

Movie data and images are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
