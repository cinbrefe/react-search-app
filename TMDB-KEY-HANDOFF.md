# Handoff: Secure the TMDB API Key (Currently Exposed Client-Side)

**Priority:** High (security)
**Area:** API key handling / build config / deployment (Vercel)
**Est. scope:** Small — 1 new serverless function, ~5 small file edits, 1 env var rename, key rotation

---

## Problem

The TMDB API key is fully exposed to anyone who visits the site.

- The app is a client-side Vite SPA. The key is read via `import.meta.env.VITE_TMDB_API_KEY`, and **any `VITE_`-prefixed var is inlined as a literal string into the production JS bundle at build time.**
- On top of that, the key is passed as a query param, so it also appears in plain text in every request in the browser's Network tab:
  ```js
  `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=...`
  ```
- TMDB does **not** support domain/referrer-restricted keys, so the key cannot be scoped to the site's origin.

**Bottom line:** No client-side technique (env vars, obfuscation, minification) can hide a secret that ships to the browser. The key must move to a server the browser cannot read from.

### Current references to fix
- `src/constants/api.js` — line 3 (`API_BASE_URL`), line 6 (`TMDB_API_KEY` export)
- `src/components/features/CardGrid/CardGrid.jsx` — import (line 8), `buildDiscoverParams` (line 18-19), URL build (lines 39-40)
- `src/components/features/CardDetails/CardDetails.jsx` — import (line 6), `useFetch` URL (line 11)
- `README.md` — env var name in setup instructions (~line 76)

---

## Recommended Solution: Serverless Proxy on Vercel

The site is hosted on Vercel (confirmed via response headers), which supports serverless functions natively — no extra infrastructure needed.

Flow:

```
Browser  ──►  /api/tmdb/search/movie?query=batman   (NO key)
                    │
                    ▼  serverless function, key read from server-side env
              api.themoviedb.org/3/search/movie?...&api_key=***   (key attached here)
```

The key lives only in a **non-`VITE_`** server env var (`TMDB_API_KEY`), so it is never bundled and never sent to the client.

### Step 1 — Add the serverless proxy function

Create `api/tmdb/[...path].js` (Vercel auto-detects files under `/api` as functions; the `[...path]` catch-all forwards any TMDB path):

```js
// Vercel serverless function — proxies requests to TMDB.
// The API key lives only in the server-side TMDB_API_KEY env var, so it is
// never shipped to the browser or exposed in network requests.

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET')
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const apiKey = process.env.TMDB_API_KEY
	if (!apiKey) {
		return res.status(500).json({ error: 'Server misconfiguration: TMDB_API_KEY is not set' })
	}

	// The [...path] catch-all exposes the trailing segments as req.query.path
	const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean)
	const pathname = segments.map(encodeURIComponent).join('/')

	// Forward every incoming query param except the internal `path`, then attach the key
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(req.query)) {
		if (key === 'path') continue
		if (Array.isArray(value)) value.forEach(v => params.append(key, v))
		else params.append(key, value)
	}
	params.set('api_key', apiKey)

	try {
		const tmdbRes = await fetch(`${TMDB_BASE_URL}/${pathname}?${params.toString()}`)
		const body = await tmdbRes.text()
		res.setHeader('Content-Type', 'application/json')
		res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
		return res.status(tmdbRes.status).send(body)
	} catch {
		return res.status(502).json({ error: 'Upstream request to TMDB failed' })
	}
}
```

### Step 2 — Point the client at the proxy

`src/constants/api.js` — swap the base URL and remove the exported key:

```js
// API constants

// Requests go through our own serverless proxy (/api/tmdb/*) so the TMDB API
// key stays server-side and is never exposed to the browser.
export const API_BASE_URL = '/api/tmdb'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w400'
export const DEFAULT_LIMIT = 19
// (remove) export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
```

`src/components/features/CardGrid/CardGrid.jsx`:
- Change the import to `import { API_BASE_URL } from '@/constants/api'`
- Remove the `apiKey` param from `buildDiscoverParams` and delete the `api_key: apiKey` line inside the `URLSearchParams`
- Update the URL builder:
  ```js
  const url = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`
      : `${API_BASE_URL}/discover/movie?${buildDiscoverParams(filters, currentPage)}`
  ```

`src/components/features/CardDetails/CardDetails.jsx`:
- Change the import to `import { API_BASE_URL, IMAGE_BASE_URL } from '@/constants/api'`
- Update the fetch URL:
  ```js
  const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/movie/${id}` : null)
  ```

### Step 3 — Keep `npm run dev` working (dev-only proxy)

The serverless function doesn't run under `vite dev`, so add a dev proxy in `vite.config.js` that mirrors it. It reads the key from `.env` on the local (server-side) dev process — still never shipped to the browser:

```js
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	// Load all env vars (including non-VITE_ ones) for use inside the config only.
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [
			react(),
			babel({ presets: [reactCompilerPreset()] })
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		// Dev-only proxy that mirrors the Vercel /api/tmdb serverless function so
		// `npm run dev` works without leaking the key to the browser.
		server: {
			proxy: {
				'/api/tmdb': {
					target: 'https://api.themoviedb.org/3',
					changeOrigin: true,
					rewrite: (p) => {
					const stripped = p.replace(/^\/api\/tmdb/, '')
					const qIdx = stripped.indexOf('?')
					const pathname = qIdx === -1 ? stripped : stripped.slice(0, qIdx)
					const search = qIdx === -1 ? '' : stripped.slice(qIdx + 1)
						const params = new URLSearchParams(search)
						params.set('api_key', env.TMDB_API_KEY)
						return `${pathname}?${params.toString()}`
					},
				},
			},
		},
	}
})
```

> Alternative: run `vercel dev` locally instead of `npm run dev`, which executes the real function. The dev proxy above is offered so the existing `npm run dev` workflow keeps working.

### Step 4 — Rename the env var (drop the `VITE_` prefix)

- **Local:** in `.env`, change `VITE_TMDB_API_KEY=...` → `TMDB_API_KEY=...`. (`.env` is already listed in `.gitignore` — no change needed there.)
- **Vercel:** Project → Settings → Environment Variables → add/rename to `TMDB_API_KEY`, then redeploy.
- Update `README.md` setup step to reference `TMDB_API_KEY` and note it must be set in Vercel.

### Step 5 — ROTATE THE KEY (do not skip)

The current key is already public — it's been in the shipped bundle and in git history. Rotating is mandatory; the proxy only protects the **new** key.

1. In TMDB account settings, regenerate / issue a new API key.
2. Set the new value as `TMDB_API_KEY` locally and in Vercel.
3. Revoke/delete the old key.

> **Git history:** If the repository is or has ever been public, the old key is permanently visible in commits. After rotating, consider rewriting history with [`git filter-repo`](https://github.com/newren/git-filter-repo) to remove the `.env` file or the key value from all past commits, then force-push. This is optional if the key is already revoked, but eliminates the exposed credential from the record entirely.

---

## Verification checklist

- [ ] `npm run build` succeeds.
- [ ] `grep -rn "$TMDB_API_KEY" dist/` after a build returns **nothing** (the actual key value is not in the bundle). Note: grepping for the variable *name* is not sufficient — Vite inlines the raw value at build time, not the identifier.
- [ ] In the browser Network tab, requests go to `/api/tmdb/...` with **no** `api_key` param.
- [ ] Search, discover/filter, and movie-details views all still load.
- [ ] `npm run dev` works locally (dev proxy) **or** team switches to `vercel dev`.
- [ ] Old TMDB key revoked; new key set in Vercel env.

## Notes / trade-offs
- Image requests (`image.tmdb.org`) need no key and stay direct — no proxy required.
- The `s-maxage` cache header reduces TMDB calls and improves latency; tune as desired.
- **Recommended hardening:** Add rate-limiting to the serverless function (e.g., via an in-memory counter or Vercel KV) to prevent anyone from using the proxy as a free pass to exhaust the TMDB API quota. Without it, the key is protected from being *read*, but the proxy endpoint is still publicly callable.
- Optional: allow-list which TMDB paths the proxy will forward (e.g., only `/search/movie`, `/discover/movie`, `/movie/:id`) to reduce the attack surface.
