// API constants

// Requests go through our own serverless proxy (/api/tmdb/*) so the TMDB API
// key stays server-side and is never exposed to the browser.
export const API_BASE_URL = '/api/tmdb'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w400'
export const DEFAULT_LIMIT = 19
