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
