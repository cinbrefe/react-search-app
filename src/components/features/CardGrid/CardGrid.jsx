import { useState } from 'react'

import './CardGrid.scss'
import Card from '@/components/features/Card/Card'
import Pagination from '@/components/ui/Pagination/Pagination'
import useFetch from '@/hooks/useFetch'
import { API_BASE_URL, TMDB_API_KEY } from '@/constants/api'

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
	const [prevQuery, setPrevQuery] = useState(query)
	const [prevFilters, setPrevFilters] = useState(filters)

	if (prevQuery !== query) {
		setPrevQuery(query)
		setCurrentPage(1)
	}

	if (prevFilters !== filters) {
		setPrevFilters(filters)
		setCurrentPage(1)
	}

	const url = query
		? `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`
		: `${API_BASE_URL}/discover/movie?${buildDiscoverParams(filters, currentPage, TMDB_API_KEY)}`

	const { data, loading, error } = useFetch(url)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data || !data.results || data.results.length === 0) return <p>No results found.</p>

	const movies = data.results.filter(movie => movie.poster_path)

	return (
		<div className='card-grid'>
			{movies.map(movie => (
				<Card
					key={movie.id}
					title={movie.title}
					release_date={movie.release_date}
					poster_path={movie.poster_path}
					onSelect={() => onSelect(movie.id)}
				/>
			))}
			<Pagination
				currentPage={currentPage}
				totalPages={Math.min(data.total_pages || 1, 500)}
				onPageChange={setCurrentPage}
			/>
		</div>
	)
}
