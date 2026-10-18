import { describe, it, expect } from 'vitest'
import buildDiscoverParams from '@/components/features/CardGrid/buildDiscoverParams'

describe('buildDiscoverParams', () => {
	it('requires at least 200 votes when sorting by rating', () => {
		const params = new URLSearchParams(buildDiscoverParams({ sortBy: 'vote_average.desc' }, 1))

		expect(params.get('vote_count.gte')).toBe('200')
	})

	it('sorts by popularity when no sort is given', () => {
		const params = new URLSearchParams(buildDiscoverParams({}, 1))

		expect(params.get('sort_by')).toBe('popularity.desc')
	})

	it('requires at least 100 votes when filtering by a minimum rating', () => {
		const params = new URLSearchParams(buildDiscoverParams({ ratingFilter: 7 }, 1))

		expect(params.get('vote_average.gte')).toBe('7')
		expect(params.get('vote_count.gte')).toBe('100')
	})
})
