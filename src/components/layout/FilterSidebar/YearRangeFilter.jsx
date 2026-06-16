import { useRef } from 'react'

export default function YearRangeFilter({ value, onChange }) {
	const debounceRef = useRef(null)

	function handleFromChange(event) {
		const yearFrom = event.target.value
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom, yearTo: value.yearTo }), 500)
	}

	function handleToChange(event) {
		const yearTo = event.target.value
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom: value.yearFrom, yearTo }), 500)
	}

	return (
		<div className="filter-group">
			<label>
				From
				<input type="number" placeholder="e.g. 2000" defaultValue={value.yearFrom} onChange={handleFromChange} />
			</label>
			<label>
				To
				<input type="number" placeholder="e.g. 2024" defaultValue={value.yearTo} onChange={handleToChange} />
			</label>
		</div>
	)
}
