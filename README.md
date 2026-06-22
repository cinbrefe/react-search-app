# Discover Movies

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
| [Lucide React](https://lucide.dev/) | latest | Icon library |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | — | Self-hosted font |
| [TMDB API](https://developer.themoviedb.org/docs) | v3 | Movie data |

## Project Structure

```
src/
├── assets/                   # Static assets (SVGs, images)
├── components/
│   ├── features/             # Domain-specific components
│   │   ├── Card/             # Movie card and skeleton
│   │   ├── CardDetails/      # Movie detail view and skeleton
│   │   └── CardGrid/         # Grid layout for cards
│   ├── layout/               # Page-level layout components
│   │   ├── FilterSidebar/    # Filter sidebar with genre, rating, year filters
│   │   └── Header/           # Site header with search and sort
│   └── ui/                   # Reusable UI primitives
│       ├── Accordion/
│       ├── ErrorBoundary/
│       ├── Form/             # Checkbox, Dropdown, Input
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

**Prerequisites:** Node.js 18+

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
   VITE_TMDB_API_KEY=your_api_key_here
   ```
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

## Accessibility

This project follows WAI-ARIA best practices to ensure an inclusive experience for all users.

- **Skip link** — allows keyboard users to bypass the header and jump directly to main content
- **Semantic HTML** — uses native elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<dialog>`, `<fieldset>`, `<legend>`) for correct landmark structure
- **Keyboard navigation** — all interactive elements are reachable and operable via keyboard
- **Screen reader announcements** — error and empty states use `aria-live="polite"` via `role="status"` to announce dynamic changes
- **Search form** — marked with `role="search"` so screen readers identify it as a search landmark
- **Modal** — uses native `<dialog>` element with `aria-modal`, `aria-label`, and `aria-describedby`; `Escape` key closes the modal
- **Accordion** — implements `aria-expanded` and `aria-controls` following the WAI-ARIA disclosure pattern
- **Pagination** — wrapped in `<nav aria-label="Pagination">`; each button has a descriptive `aria-label` and `aria-current="page"` for the active page
- **Card list** — uses `role="list"` with a contextual `aria-label` that reflects search or browse state
- **Form controls** — all inputs, selects, and checkboxes have associated `<label>` elements via `htmlFor`/`id`
- **Filter groups** — grouped with `role="group"` and `aria-label` for context
- **Buttons** — all icon-only buttons have `aria-label` for screen reader context
- **Images** — decorative poster images use `alt=""` and `aria-hidden="true"` to avoid redundant announcements
- **Visually hidden content** — uses a `.visually-hidden` utility class for labels meaningful to screen readers but not needed visually

## Linting

ESLint is configured with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y` for React best practices and accessibility checks.
