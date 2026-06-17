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

## Path Aliases

This project uses the `@` alias to reference the `src/` directory, avoiding brittle relative imports:

```js
import { useFetch } from '@/hooks/useFetch'
import { TMDB_API_KEY } from '@/constants/api'
```

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
4. Start the dev server: `npm run dev`
