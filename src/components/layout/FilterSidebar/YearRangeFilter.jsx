import { useRef, useEffect, useState } from 'react'

export default function YearRangeFilter({ value, onChange }) {
	const debounceRef = useRef(null)
	const [localFrom, setLocalFrom] = useState(value.yearFrom)
	const [localTo, setLocalTo] = useState(value.yearTo)

	useEffect(() => {
		setLocalFrom(value.yearFrom)
		setLocalTo(value.yearTo)
	}, [value.yearFrom, value.yearTo])

	useEffect(() => {
		return () => clearTimeout(debounceRef.current)
	}, [])

	function handleFromChange(event) {
		const yearFrom = event.target.value
		setLocalFrom(yearFrom)
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom, yearTo: value.yearTo }), 500)
	}

	function handleToChange(event) {
		const yearTo = event.target.value
		setLocalTo(yearTo)
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom: value.yearFrom, yearTo }), 500)
	}

	return (
		<div className='filter-group'>
			<label htmlFor='year-from'>
				From
				<input id='year-from' type='number' placeholder='e.g. 2000' min='1900' max={new Date().getFullYear()} value={localFrom} onChange={handleFromChange} />
			</label>
			<label htmlFor='year-to'>
				To
				<input id='year-to' type='number' placeholder='e.g. 2024' min='1900' max={new Date().getFullYear()} value={localTo} onChange={handleToChange} />
			</label>
		</div>
	)
}
