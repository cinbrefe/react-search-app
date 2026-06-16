import Dropdown from '../../ui/Form/Dropdown/Dropdown'
import { SORT_OPTIONS } from '../../../constants/filters'

export default function SortFilter({ value, onChange }) {
	function handleChange(event) {
		onChange(event.target.value)
	}

	return (
		<div className="filter-group">
			<h3>Sort</h3>
			<form>
				<label>
					Sort by:
					<Dropdown
						options={SORT_OPTIONS}
						value={value}
						onChange={handleChange}
					/>
				</label>
			</form>
		</div>
	)
}
