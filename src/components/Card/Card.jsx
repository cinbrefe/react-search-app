import './Card.scss'

export default function Card({ title, artist_title, image_id, onSelect }) {
	return (
		<button className="card" onClick={onSelect}>
			<img src={`https://www.artic.edu/iiif/2/${image_id}/full/400,/0/default.jpg`} alt={title} />
			<h2>{title}</h2>
			<p>{artist_title}</p>
		</button>
	)
}