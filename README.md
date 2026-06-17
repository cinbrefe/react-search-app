# react-search-app

A movie search and discovery app where you can explore popular films, search by title, and filter by genre, rating, and year. Built with React and powered by the TMDB API.

## Features

- Search movies by title
- Browse popular movies
- Filter by genre, rating, and year range
- Sort by popularity, release date, or rating
- View movie details in a modal
- Collapsible filter sidebar with accordion

## Tech Stack

- React 19
- Sass
- TMDB API

## Linting

This project uses ESLint with the following plugins:

- `eslint-plugin-react` — React-specific linting rules
- `eslint-plugin-react-hooks` — enforces React hooks rules
- `eslint-plugin-jsx-a11y` — accessibility checks for JSX elements

To run the linter:

```bash
npx eslint src/
```

## Path Aliases

This project uses the `@` alias to reference the `src/` directory, avoiding brittle relative imports:

```js
import { useFetch } from '@/hooks/useFetch'
import { TMDB_API_KEY } from '@/constants/api'
```

## Accessibility

This project follows WAI-ARIA best practices to ensure an inclusive experience for all users.

- **Skip link** — allows keyboard users to bypass the header and jump directly to main content
- **Semantic HTML** — uses native elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<dialog>`, `<fieldset>`, `<legend>`) for correct landmark structure
- **Keyboard navigation** — all interactive elements are reachable and operable via keyboard
- **Screen reader announcements** — loading, error, and empty states use `aria-live="polite"` to announce dynamic changes
- **Modal** — uses native `<dialog>` element with `aria-modal`, `aria-label`, and `aria-describedby` for full screen reader support; `Escape` key closes the modal
- **Accordion** — implements `aria-expanded`, `aria-controls`, and `role="region"` following the WAI-ARIA disclosure pattern
- **Form controls** — all inputs, selects, and checkboxes have associated `<label>` elements via `htmlFor`/`id`
- **Checkbox groups** — grouped with `role="group"` and `aria-label` for context
- **Buttons** — all buttons use native `<button>` elements with accessible labels via text content or `aria-label`
- **Images** — decorative images use `alt=""` and `aria-hidden="true"` to avoid redundant announcements
- **Visually hidden content** — uses a `.visually-hidden` utility class for labels that are meaningful to screen readers but not needed visually

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
4. Start the dev server: `npm run dev`
