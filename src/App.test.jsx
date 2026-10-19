import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import App from '@/App'

const popularMovie = { id: 2, title: 'Popular One', poster_path: '/b.jpg' }
const batman = { id: 1, title: 'Batman Begins', poster_path: '/a.jpg' }

const server = setupServer(
	// Popular movies, shown when the app first loads
	http.get('/api/tmdb/discover/movie', () => HttpResponse.json({ results: [popularMovie], total_results: 1, total_pages: 1 })),
	// Search results
	http.get('/api/tmdb/search/movie', () => HttpResponse.json({ results: [batman], total_results: 1, total_pages: 1 })),
	// One movie's details, for the modal
	http.get('/api/tmdb/movie/:id', () => HttpResponse.json({
		...batman,
		overview: 'A young Bruce Wayne becomes Batman.',
		release_date: '2005-06-15',
		runtime: 140,
		vote_average: 7.7,
		genres: [{ id: 28, name: 'Action' }],
	})),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('App', () => {
	it('searches for a movie and opens its details', async () => {
		const user = userEvent.setup()
		document.body.innerHTML = '<div id="modal"></div>'
		render(<App />)

		expect(await screen.findByRole('button', { name: 'View details for Popular One' })).toBeInTheDocument()

		const searchBox = screen.getByRole('textbox', { name: 'Search movies' })
		await user.type(searchBox, 'batman{Enter}')
		expect(await screen.findByRole('button', { name: 'View details for Batman Begins' })).toBeInTheDocument()
		expect(searchBox).toHaveValue('batman')

		await user.click(screen.getByRole('button', { name: 'View details for Batman Begins' }))
		const modal = await screen.findByRole('dialog', { name: 'Movie details' })
		expect(await within(modal).findByText('A young Bruce Wayne becomes Batman.')).toBeInTheDocument()

		await user.click(within(modal).getByRole('button', { name: 'Close' }))
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})
})