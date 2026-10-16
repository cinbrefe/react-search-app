import '@/components/features/Card/CardSkeleton.scss'

export default function CardSkeleton() {
	return (
		<div className='card-skeleton' aria-hidden='true'>
			<div className='card-skeleton__image' />
		</div>
	)
}