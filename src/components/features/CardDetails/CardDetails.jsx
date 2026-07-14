// Props:
//	id (number)

import useFetch from '@/hooks/useFetch'

import { API_BASE_URL, IMAGE_BASE_URL } from '@/constants/api'
import CardDetailSkeleton from '@/components/features/CardDetails/CardDetailSkeleton'
import '@/components/features/CardDetails/CardDetails.scss'

export default function CardDetails({ id }) {
	const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/movie/${id}` : null)

	if (loading) return <CardDetailSkeleton />
	if (error) return <p>Error: {error.message}</p>
	if (!data) return <p>No results found.</p>

	const { poster_path, title, overview, release_date, genres, vote_average, runtime } = data

	return (
		<div className='card-details'>
			<img
				className='card-details__poster'
				src={`${IMAGE_BASE_URL}${poster_path}`}
				alt={title}
			/>
			<div className='card-details__content'>
				<h2 className='card-details__title h1'>{title}</h2>
				<dl className='card-details__meta'>
					<div className='card-details__meta-item'>
						<dt className='card-details__meta-label'>Release date:</dt>
						<dd className='card-details__meta-value'>{release_date?.slice(0, 4)}</dd>
					</div>
					<div className='card-details__meta-item'>
						<dt className='card-details__meta-label'>Runtime:</dt>
						<dd className='card-details__meta-value'>{runtime} min</dd>
					</div>
					<div className='card-details__meta-item'>
						<dt className='card-details__meta-label'>Rating:</dt>
						<dd className='card-details__meta-value'>{vote_average ? `${vote_average.toFixed(1)} / 10` : ''}</dd>
					</div>
					<div className='card-details__meta-item'>
						<dt className='card-details__meta-label'>Genre:</dt>
						<dd className='card-details__meta-value'>{genres?.map(g => g.name).join(', ')}</dd>
					</div>
				</dl>
				<p className='card-details__overview-label'>Overview</p>
				<p className='card-details__overview'>{overview}</p>
			</div>
		</div>
	)
}
