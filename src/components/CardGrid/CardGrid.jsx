import { useState } from 'react'

import './CardGrid.scss'
import Card from '../Card/Card'
import Pagination from '../ui/Pagination/Pagination'
import useFetch from '../../hooks/useFetch'
import { API_BASE_URL, DEFAULT_LIMIT } from '../../constants/api'

export default function CardGrid({ query, filters, onSelect }) {
	const [currentPage, setCurrentPage] = useState(1)
	const [prevQuery, setPrevQuery] = useState(query)

	// Reset to first page when query changes
	if (prevQuery !== query) {
		setPrevQuery(query)
		setCurrentPage(1)
	}

	const url = query
		? `${API_BASE_URL}/artworks/search?q=${query}&limit=${DEFAULT_LIMIT}&fields=id,title,artist_title,image_id,artwork_type_title,place_of_origin,date_start,date_end&page=${currentPage}`
		: `${API_BASE_URL}/artworks?limit=${DEFAULT_LIMIT}&fields=id,title,artist_title,image_id,artwork_type_title,place_of_origin,date_start,date_end&query[term][is_public_domain]=true&page=${currentPage}`

	const { data, loading, error } = useFetch(url)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data || !data.data || data.data.length === 0) return <p>No results found.</p>

	// Apply filters client-side
	const artworks = data.data.filter(artwork => {
		if (!artwork.image_id) return false
		if (filters?.artwork_type_title?.length > 0 && !filters.artwork_type_title.includes(artwork.artwork_type_title)) return false
		if (filters?.place_of_origin?.length > 0 && !filters.place_of_origin.includes(artwork.place_of_origin)) return false
		if (filters?.dateFrom && artwork.date_start < Number(filters.dateFrom)) return false
		if (filters?.dateTo && artwork.date_end > Number(filters.dateTo)) return false
		return true
	})

	return (
		<div className="card-grid">
			{artworks.map(artwork => (
				<Card
					key={artwork.id}
					title={artwork.title}
					artist_title={artwork.artist_title}
					image_id={artwork.image_id}
					onSelect={() => onSelect(artwork.id)}
				/>
			))}
			<Pagination
				currentPage={currentPage}
				totalPages={data.pagination?.total_pages || 1}
				onPageChange={setCurrentPage}
			/>
		</div>
	)
}
