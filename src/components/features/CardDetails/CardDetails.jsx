import useFetch from '@/hooks/useFetch'
import { API_BASE_URL, IMAGE_BASE_URL, TMDB_API_KEY } from '@/constants/api'

export default function CardDetails({ id }) {
	const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}` : null)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data) return <p>No results found.</p>

	const { poster_path, title, overview, release_date, genres, vote_average, runtime } = data

	return (
		<div className='artwork-details'>
			<img src={`${IMAGE_BASE_URL}${poster_path}`} alt={title} />
			<h2>{title}</h2>
			<p>
				<span style={{ fontWeight: 'bold' }}>Release date:</span>
				{release_date?.slice(0, 4)}
			</p>
			<p>
				<span style={{ fontWeight: 'bold' }}>Runtime:</span>
				{runtime} min
			</p>
			<p>
				<span style={{ fontWeight: 'bold' }}>Genre:</span>
				{genres?.map(g => g.name).join(', ')}
			</p>
			<p>
				<span style={{ fontWeight: 'bold' }}>Rating:</span>
				{vote_average ? `${vote_average.toFixed(1)} / 10` : ''}
			</p>
			<p style={{ fontWeight: 'bold' }}>Overview:</p>
			<p>{overview}</p>
		</div>
	)
}
