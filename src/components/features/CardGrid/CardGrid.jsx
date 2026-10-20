// Props:
//	query (string)
//	filters (object)
//	onSelect (function)
//	onStatusChange (function) — receives a message for screen readers when results, errors or "no results" appear

import { useState, useEffect, useRef } from 'react'

import { API_BASE_URL } from '@/constants/api'
import useFetch from '@/hooks/useFetch'
import buildDiscoverParams from '@/components/features/CardGrid/buildDiscoverParams'

import Card from '@/components/features/Card/Card'
import CardSkeleton from '@/components/features/Card/CardSkeleton'
import Pagination from '@/components/ui/Pagination/Pagination'

import '@/components/features/CardGrid/CardGrid.scss'

export default function CardGrid({ query, filters, onSelect, onStatusChange }) {
	const [currentPage, setCurrentPage] = useState(1)

	const url = query
		? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}&include_adult=false`
		: `${API_BASE_URL}/discover/movie?${buildDiscoverParams(filters, currentPage)}`

	const { data, loading, error } = useFetch(url)
	const resultsHeadingRef = useRef(null)
	const focusResultsRef = useRef(false)

	// Changing page unmounts Pagination while loading, which would drop keyboard focus to <body>
	function handlePageChange(page) {
		focusResultsRef.current = true
		setCurrentPage(page)
	}

	useEffect(() => {
		if (data && focusResultsRef.current) {
			focusResultsRef.current = false
			resultsHeadingRef.current?.focus()
		}
	}, [data])

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
	const resultsLabel = query ? `Search results for "${query}"` : 'Popular movies'

	return (
		<div className='card-grid'>
			<h2 className='visually-hidden' ref={resultsHeadingRef} tabIndex={-1}>{resultsLabel}, page {currentPage}</h2>
			<ul className='card-grid__list' aria-label={resultsLabel}>
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
				onPageChange={handlePageChange}
			/>
		</div>
	)
}
