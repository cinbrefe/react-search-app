// Props:
//	title (string)
//	poster_path (string)
//	onSelect (function)
//	priority (boolean, optional) — load the poster right away instead of lazily (cards visible on first load)

import { IMAGE_BASE_URL } from '@/constants/api'

import '@/components/features/Card/Card.scss'

export default function Card({ title, poster_path, onSelect, priority = false }) {
	return (
		<button
			aria-label={`View details for ${title}`}
			className='card'
			onClick={onSelect}
			type='button'
		>
			<img
				className='card__image'
				src={`${IMAGE_BASE_URL}${poster_path}`}
				alt=''
				aria-hidden='true'
				width='400'
				height='600'
				loading={priority ? 'eager' : 'lazy'}
			/>
		</button>
	)
}
