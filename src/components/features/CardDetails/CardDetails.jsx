// Props:
//	id (number)

import useFetch from '@/hooks/useFetch'

import { API_BASE_URL, DETAIL_IMAGE_BASE_URL } from '@/constants/api'
import CardDetailSkeleton from '@/components/features/CardDetails/CardDetailSkeleton'
import '@/components/features/CardDetails/CardDetails.scss'

export default function CardDetails({ id }) {
	const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/movie/${id}` : null)

	if (error) return <p className='error-message' role='alert'>Sorry, we couldn't load this movie. Please close this window and try again.</p>
	// No data yet also covers the first render, before the request has started
	if (loading || !data) return <CardDetailSkeleton />

	const { poster_path, title, overview, release_date, genres, vote_average, runtime } = data

	return (
		<div className='card-details'>
			<img
				className='card-details__poster'
				src={`${DETAIL_IMAGE_BASE_URL}${poster_path}`}
				alt={title}
				width='500'
				height='750'
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
				<h3 className='card-details__overview-label'>Overview</h3>
				<p className='card-details__overview'>{overview}</p>
			</div>
		</div>
	)
}
