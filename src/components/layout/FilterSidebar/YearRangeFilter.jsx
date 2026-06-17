import { useRef, useEffect } from 'react'

export default function YearRangeFilter({ value, onChange }) {
	const debounceRef = useRef(null)

	useEffect(() => {
		return () => clearTimeout(debounceRef.current)
	}, [])

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
		<div className='filter-group'>
			<label htmlFor='year-from'>
				From
				<input id='year-from' type='number' placeholder='e.g. 2000' min='1900' max={new Date().getFullYear()} defaultValue={value.yearFrom} onChange={handleFromChange} />
			</label>
			<label htmlFor='year-to'>
				To
				<input id='year-to' type='number' placeholder='e.g. 2024' min='1900' max={new Date().getFullYear()} defaultValue={value.yearTo} onChange={handleToChange} />
			</label>
		</div>
	)
}
