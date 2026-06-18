import { useState } from 'react'

import '@/components/features/CardGrid/CardGrid.scss'
import Card from '@/components/features/Card/Card'
import Pagination from '@/components/ui/Pagination/Pagination'
import useFetch from '@/hooks/useFetch'
import { API_BASE_URL, TMDB_API_KEY } from '@/constants/api'
import Loading from '@/components/ui/Loading/Loading'

function buildDiscoverParams(filters, page, apiKey) {
	const params = new URLSearchParams({
		api_key: apiKey,
		page,
	})
	params.set('sort_by', filters?.sortBy || 'popularity.desc')
	if (filters?.genres?.length > 0) params.set('with_genres', filters.genres.join(','))
	if (filters?.ratingFilter) {
		params.set('vote_average.gte', filters.ratingFilter)
		params.set('vote_count.gte', 100)
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

	if (loading) return <Loading message={query ? `Searching for "${query}"...` : 'Loading movies...'} />
	if (error) return <p role='status' aria-live='polite'>Error: {error.message}</p>
	if (!data?.results?.length) return <p role='status' aria-live='polite'>{query ? `No results found for "${query}"` : 'No movies available.'}</p>

	const movies = data.results.filter(movie => movie.poster_path)

	return (
		<div className='card-grid'>
			<ul className='card-grid__list' role='list' aria-label={query ? `Search results for "${query}"` : 'Popular movies'}>
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
