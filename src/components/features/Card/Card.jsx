import './Card.scss'
import { IMAGE_BASE_URL } from '@/constants/api'

export default function Card({ title, release_date, poster_path, onSelect }) {
	return (
		<button className='card' onClick={onSelect}>
			<img src={`${IMAGE_BASE_URL}${poster_path}`} alt={title} />
			<h2>{title}</h2>
			<p>{release_date?.slice(0, 4)}</p>
		</button>
	)
}
