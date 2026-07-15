// Vercel serverless function — proxies all /api/tmdb/* requests to TMDB.
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

	// req.query.path may be a string ('tmdb/discover/movie') or array (['tmdb','discover','movie'])
	// depending on whether routing came via a rewrite or direct catch-all match
	const rawPath = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '')
	const segments = rawPath.split('/').filter(Boolean)
	if (segments[0] !== 'tmdb') {
		return res.status(404).json({ error: 'Not found' })
	}
	const tmdbPath = segments.slice(1).join('/')

	// Forward every incoming query param except the internal `path`, then attach the key
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(req.query)) {
		if (key === 'path') continue
		if (Array.isArray(value)) value.forEach(v => params.append(key, v))
		else params.append(key, value)
	}
	params.set('api_key', apiKey)

	try {
		const tmdbRes = await fetch(`${TMDB_BASE_URL}/${tmdbPath}?${params.toString()}`)
		const body = await tmdbRes.text()
		res.setHeader('Content-Type', 'application/json')
		res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
		return res.status(tmdbRes.status).send(body)
	} catch {
		return res.status(502).json({ error: 'Upstream request to TMDB failed' })
	}
}
