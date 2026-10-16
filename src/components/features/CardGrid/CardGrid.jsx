// Props:
//	query (string)
//	filters (object)
//	onSelect (function)
//	onStatusChange (function) — receives a message for screen readers when results, errors or "no results" appear

import { useState, useEffect } from 'react'

import { API_BASE_URL } from '@/constants/api'
import useFetch from '@/hooks/useFetch'

import Card from '@/components/features/Card/Card'
import CardSkeleton from '@/components/features/Card/CardSkeleton'
import Pagination from '@/components/ui/Pagination/Pagination'

import '@/components/features/CardGrid/CardGrid.scss'

function buildDiscoverParams(filters, page) {
	const params = new URLSearchParams({ page, include_adult: false })
	const sortBy = filters?.sortBy || 'popularity.desc'
	params.set('sort_by', sortBy)
	if (sortBy === 'vote_average.desc') params.set('vote_count.gte', 200)
	if (filters?.genres?.length > 0) params.set('with_genres', filters.genres.join(','))
	if (filters?.ratingFilter) {
		params.set('vote_average.gte', filters.ratingFilter)
		if (!params.has('vote_count.gte')) params.set('vote_count.gte', 100)
	}
	if (filters?.yearFrom) params.set('primary_release_date.gte', `${filters.yearFrom}-01-01`)
	if (filters?.yearTo) params.set('primary_release_date.lte', `${filters.yearTo}-12-31`)
	if (sortBy === 'release_date.desc') {
		// Newest first would otherwise start with unreleased films that have no votes yet
		const today = new Date().toISOString().slice(0, 10)
		const releasedBy = params.get('primary_release_date.lte')
		if (!releasedBy || releasedBy > today) params.set('primary_release_date.lte', today)
		if (!params.has('vote_count.gte')) params.set('vote_count.gte', 10)
	}
	return params.toString()
}

export default function CardGrid({ query, filters, onSelect, onStatusChange }) {
	const [currentPage, setCurrentPage] = useState(1)

	const url = query
		? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}&include_adult=false`
		: `${API_BASE_URL}/discover/movie?${buildDiscoverParams(filters, currentPage)}`

	const { data, loading, error } = useFetch(url)

	// Announced through App's status region, which (unlike this component) isn't remounted on every search
	useEffect(() => {
		if (error) onStatusChange('Something went wrong. Please try again later.')
		else if (data && !data.results?.length) onStatusChange(query ? `No results found for "${query}"` : 'No movies available.')
		else if (data) {
			const total = data.total_results.toLocaleString('en-US')
			onStatusChange(`${query ? `${total} results for "${query}"` : `${total} movies`}, page ${currentPage}`)
		}
	}, [data, error, query, currentPage, onStatusChange])

	if (loading) return (
		<ul className='card-grid__list' aria-label='Loading movies' aria-busy='true'>
			{Array.from({ length: 20 }).map((_, i) => (
				<li key={`skeleton-${i}`}><CardSkeleton /></li>
			))}
		</ul>
	)
	if (error) return <p className='error-message'>Something went wrong. Please try again later.</p>
	if (!data?.results?.length) return <p className='error-message'>{query ? `No results found for "${query}"` : 'No movies available.'}</p>

	const movies = data.results.filter(movie => movie.poster_path)

	return (
		<div className='card-grid'>
			<ul className='card-grid__list' aria-label={query ? `Search results for "${query}"` : 'Popular movies'}>
				{movies.map((movie, index) => (
					<li key={movie.id}>
						<Card
							title={movie.title}
							poster_path={movie.poster_path}
							onSelect={() => onSelect(movie.id)}
							priority={index < 4} // first row on desktop, first two rows on mobile
						/>
					</li>
				))}
			</ul>
			<Pagination
				currentPage={currentPage}
				totalPages={Math.min(data.total_pages || 1, 500)}
				onPageChange={setCurrentPage}
			/>
		</div>
	)
}
