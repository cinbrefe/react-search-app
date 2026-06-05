import Card from '../Card/Card'
import './CardGrid.scss'

export default function CardGrid() {
	return (
		<div className="card-grid">
			<Card />

			<Card />
			<Card />
			<Card />
			<Card />
		</div>
	)
}