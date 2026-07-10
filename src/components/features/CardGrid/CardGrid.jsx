// Props:
//	query (string)
//	filters (object)
//	onSelect (function)

import { useState } from 'react'

import { API_BASE_URL, TMDB_API_KEY } from '@/constants/api'
import useFetch from '@/hooks/useFetch'

import Card from '@/components/features/Card/Card'
import CardSkeleton from '@/components/features/Card/CardSkeleton'
import Pagination from '@/components/ui/Pagination/Pagination'

import '@/components/features/CardGrid/CardGrid.scss'

function buildDiscoverParams(filters, page, apiKey) {
	const params = new URLSearchParams({
		api_key: apiKey,
		page,
	})
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
	return params.toString()
}

export default function CardGrid({ query, filters, onSelect }) {
	const [currentPage, setCurrentPage] = useState(1)

	const url = query
		? `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`
		: `${API_BASE_URL}/discover/movie?${buildDiscoverParams(filters, currentPage, TMDB_API_KEY)}`

	const { data, loading, error } = useFetch(url)

	if (loading) return (
		<ul className='card-grid__list' aria-label='Loading movies'>
			{Array.from({ length: 20 }).map((_, i) => (
				<li key={`skeleton-${i}`}><CardSkeleton /></li>
			))}
		</ul>
	)
	if (error) return <p className='error-message' role='status' aria-live='polite'>Something went wrong. Please try again later.</p>
	if (!data?.results?.length) return <p className='error-message' role='status' aria-live='polite'>{query ? `No results found for "${query}"` : 'No movies available.'}</p>

	const movies = data.results.filter(movie => movie.poster_path)

	return (
		<div className='card-grid'>
			<ul className='card-grid__list' aria-label={query ? `Search results for "${query}"` : 'Popular movies'}>
				{movies.map(movie => (
					<li key={movie.id}>
						<Card
							title={movie.title}
							poster_path={movie.poster_path}
							onSelect={() => onSelect(movie.id)}
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
