import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
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

// The year filter waits 500 ms before applying a typed year
const waitPastYearDelay = () => new Promise(resolve => setTimeout(resolve, 700))

// Records every discover request, so a test can check which filters were actually sent
function recordDiscoverRequests() {
	const requests = []
	server.use(http.get('/api/tmdb/discover/movie', ({ request }) => {
		requests.push(new URL(request.url).searchParams)
		return HttpResponse.json({ results: [popularMovie], total_results: 1, total_pages: 3 })
	}))
	return requests
}

function renderApp() {
	document.body.innerHTML = '<div id="modal"></div>'
	render(<App />)
	return screen.findByRole('button', { name: 'View details for Popular One' })
}

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

	it('keeps the sort order when a genre filter is added', async () => {
		const user = userEvent.setup()
		document.body.innerHTML = '<div id="modal"></div>'
		render(<App />)
		await screen.findByRole('button', { name: 'View details for Popular One' })

		// 1. Sort by rating
		const sortSelect = screen.getByRole('combobox', { name: 'Sort by:' })
		await user.selectOptions(sortSelect, 'vote_average.desc')

		// 2. Tick "Action" (the filter panels start open on desktop; jsdom's default window is desktop-sized)
		await user.click(screen.getByRole('checkbox', { name: 'Action' }))

		// 3. The sort must still be "Rating" (check the option's value, not its text)
		expect(sortSelect).toHaveValue('vote_average.desc')
	})

	// B1: the year's delayed update used to send an old copy of the filters, un-ticking the genre
	it('keeps a genre ticked while a typed year is being applied', async () => {
		const user = userEvent.setup()
		const requests = recordDiscoverRequests()
		await renderApp()

		await user.type(screen.getByRole('spinbutton', { name: 'From' }), '2000')
		await user.click(screen.getByRole('checkbox', { name: 'Action' }))
		await waitPastYearDelay()

		expect(screen.getByRole('checkbox', { name: 'Action' })).toBeChecked()
		await waitFor(() => expect(requests.at(-1).get('primary_release_date.gte')).toBe('2000-01-01'))
		expect(requests.at(-1).get('with_genres')).toBe('28')
	})

	// B2: a year still waiting to be applied used to bring the filters back after Reset
	it('keeps the filters cleared when Reset is clicked while a year is being applied', async () => {
		const user = userEvent.setup()
		const requests = recordDiscoverRequests()
		await renderApp()

		await user.click(screen.getByRole('checkbox', { name: 'Action' }))
		await user.type(screen.getByRole('spinbutton', { name: 'From' }), '2000')
		await user.click(screen.getByRole('button', { name: 'Reset Filters' }))
		await waitPastYearDelay()

		expect(screen.getByRole('checkbox', { name: 'Action' })).not.toBeChecked()
		expect(screen.getByRole('spinbutton', { name: 'From' })).toHaveValue(null)
		expect(requests.at(-1).get('with_genres')).toBe(null)
		expect(requests.at(-1).get('primary_release_date.gte')).toBe(null)
	})

	// B3: an invalid year is never applied, so Reset used to leave it (and its error) in the box
	it('clears an invalid year when Reset is clicked', async () => {
		const user = userEvent.setup()
		await renderApp()

		await user.click(screen.getByRole('checkbox', { name: 'Action' }))
		await user.type(screen.getByRole('spinbutton', { name: 'From' }), '1800')
		await user.click(screen.getByRole('button', { name: 'Reset Filters' }))

		// Find the input again: Reset replaces it with a fresh one
		const fromInput = screen.getByRole('spinbutton', { name: 'From' })
		expect(fromInput).toHaveValue(null)
		expect(fromInput).not.toHaveAttribute('aria-invalid', 'true')
	})

	// B4: Pagination disappears while the next page loads, which used to drop focus to <body>
	it('moves focus to the results after changing page', async () => {
		const user = userEvent.setup()
		recordDiscoverRequests()
		await renderApp()

		await user.click(screen.getByRole('button', { name: 'Go to next page' }))

		await waitFor(() => expect(screen.getByRole('heading', { name: 'Popular movies, page 2' })).toHaveFocus())
	})
})
