import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import useFetch from '@/hooks/useFetch'

// The fake API: every test gets this movie unless it overrides the handler
const server = setupServer(
	http.get('/api/tmdb/movie/:id', ({ params }) => HttpResponse.json({ id: Number(params.id), title: 'Test Movie' })),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useFetch', () => {
	it('loads the data', async () => {
		const { result } = renderHook(() => useFetch('/api/tmdb/movie/42'))

		expect(result.current.loading).toBe(true)

		await waitFor(() => expect(result.current.loading).toBe(false))
		expect(result.current.data).toEqual({ id: 42, title: 'Test Movie' })
		expect(result.current.error).toBe(null)
	})

	it('returns an error when the server fails', async () => {
		server.use(http.get('/api/tmdb/movie/:id', () => new HttpResponse(null, { status: 500 })))

		const { result } = renderHook(() => useFetch('/api/tmdb/movie/42'))

		expect(result.current.loading).toBe(true)

		await waitFor(() => expect(result.current.loading).toBe(false))
		expect(result.current.data).toBe(null)
		expect(result.current.error).toBeInstanceOf(Error)
		expect(result.current.error.message).toBe('Request failed with status 500')
	})

	it('does not fetch when url is null', () => {
		const { result } = renderHook(() => useFetch(null))

		expect(result.current.loading).toBe(false)
		expect(result.current.data).toBe(null)
		expect(result.current.error).toBe(null)
	})
})
