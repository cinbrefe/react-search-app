import '@/components/features/CardDetails/CardDetailSkeleton.scss'

export default function CardDetailSkeleton() {
	return (
		<div className='card-detail-skeleton'>
			<div className='card-detail-skeleton__poster' />
			<div className='card-detail-skeleton__content'>
				<div className='card-detail-skeleton__title' />
				<div className='card-detail-skeleton__meta'>
					<div className='card-detail-skeleton__meta-item' />
					<div className='card-detail-skeleton__meta-item' />
					<div className='card-detail-skeleton__meta-item' />
				</div>
				<div className='card-detail-skeleton__overview-label' />
				<div className='card-detail-skeleton__overview' />
				<div className='card-detail-skeleton__overview' />
				<div className='card-detail-skeleton__overview' />
			</div>
		</div>
	)
}
