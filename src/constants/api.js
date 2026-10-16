// Requests go through our own serverless proxy (/api/tmdb/*) so the TMDB API
// key stays server-side and is never exposed to the browser.
export const API_BASE_URL = '/api/tmdb'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w400'
// Larger size for the details modal: the poster shows at up to 250px, so 500px stays sharp on 2x screens
export const DETAIL_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
