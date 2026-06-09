import useFetch from '../../hooks/useFetch'
import { API_BASE_URL } from '../../constants/api'

export default function ArtworkDetails({ id }) {
	const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/artworks/${id}` : null)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data || !data.data) return <p>No results found.</p>
	
	const { image_id, title, artist_title, date_display, medium_display } = data.data;

	return (
		<div className="artwork-details">
			<img src={`https://www.artic.edu/iiif/2/${image_id}/full/400,/0/default.jpg`} alt={title} />
			<h2>{title}</h2>
			<p>{artist_title}</p>
			<p>{date_display}</p>
			<p>{medium_display}</p>
		</div>
	)
}