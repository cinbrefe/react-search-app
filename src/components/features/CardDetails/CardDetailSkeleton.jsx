import '@/components/features/CardDetails/CardDetailSkeleton.scss'

export default function CardDetailSkeleton() {
	return (
		<>
			<p className='visually-hidden' role='status'>Loading movie details</p>
			<div className='card-details-skeleton' aria-hidden='true'>
				<div className='card-details-skeleton__poster' />
				<div className='card-details-skeleton__content'>
					<div className='card-details-skeleton__title' />
					<div className='card-details-skeleton__meta'>
						<div className='card-details-skeleton__meta-item' />
						<div className='card-details-skeleton__meta-item' />
						<div className='card-details-skeleton__meta-item' />
					</div>
					<div className='card-details-skeleton__overview-label' />
					<div className='card-details-skeleton__overview' />
					<div className='card-details-skeleton__overview' />
					<div className='card-details-skeleton__overview' />
				</div>
			</div>
		</>
	)
}
