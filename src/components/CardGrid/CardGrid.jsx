import './CardGrid.scss'
import Card from '../Card/Card'
import useFetch from '../../hooks/useFetch'
import { API_BASE_URL, DEFAULT_LIMIT } from '../../constants/api'

export default function CardGrid({ query, onSelect }) {
	const url = query 
		 ? `${API_BASE_URL}/artworks/search?q=${query}&limit=${DEFAULT_LIMIT}&fields=id,title,artist_title,image_id`
		 : `${API_BASE_URL}/artworks?limit=${DEFAULT_LIMIT}&query[term][is_public_domain]=true` 
	const { data, loading, error } = useFetch(url)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data || !data.data || data.data.length === 0) return <p>No results found.</p>

	return (
		<div className="card-grid">
			{data.data.filter(artwork => artwork.image_id).map(artwork => (
				<Card 
					key={artwork.id} 
					title={artwork.title} 
					artist_title={artwork.artist_title} 
					image_id={artwork.image_id}
					onSelect={() => onSelect(artwork.id)}
				/>
			))}
		</div>
	)
}