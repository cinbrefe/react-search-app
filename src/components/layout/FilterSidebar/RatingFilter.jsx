import Checkbox from '../../ui/Form/Checkbox/Checkbox'
import { RATINGS } from '../../../constants/filters'

export default function RatingFilter({ value, onChange }) {
	function handleChange(event) {
		const rating = Number(event.target.value)
		onChange(event.target.checked ? rating : '')
	}

	return (
		<div className="filter-group">
			<h3>Rating</h3>
			<form>
				{RATINGS.map(r => (
					<Checkbox
						key={r}
						label={`${r}+`}
						value={r}
						checked={value === r}
						onChange={handleChange}
					/>
				))}
			</form>
		</div>
	)
}
