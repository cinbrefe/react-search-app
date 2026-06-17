import './Card.scss'
import { IMAGE_BASE_URL } from '@/constants/api'

export default function Card({ title, poster_path, onSelect }) {
	return (
		<button
			aria-label={`View details for ${title}`}
			className='card' 
			onClick={onSelect}
			type='button'
		>
			<img src={`${IMAGE_BASE_URL}${poster_path}`} alt='' aria-hidden='true' />
		</button>
	)
}
