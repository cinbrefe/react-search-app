// Props:
//	value (object: { yearFrom: string, yearTo: string })
//	onChange (function)

import { useRef, useEffect, useState } from 'react'

export default function YearRangeFilter({ value, onChange }) {
	const debounceRef = useRef(null) // delays onChange by 500ms so it doesn't fire on every keystroke
	const [localFrom, setLocalFrom] = useState(value.yearFrom)
	const [localTo, setLocalTo] = useState(value.yearTo)
	const [prevValue, setPrevValue] = useState(value)

	// Sync the inputs when the parent changes the years (e.g. Reset Filters) — done during render, not in an effect
	if (value.yearFrom !== prevValue.yearFrom || value.yearTo !== prevValue.yearTo) {
		setPrevValue(value)
		setLocalFrom(value.yearFrom)
		setLocalTo(value.yearTo)
	}

	useEffect(() => {
		return () => clearTimeout(debounceRef.current)
	}, [])

	function handleFromChange(event) {
		const yearFrom = event.target.value
		setLocalFrom(yearFrom)
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom, yearTo: localTo }), 500)
	}

	function handleToChange(event) {
		const yearTo = event.target.value
		setLocalTo(yearTo)
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onChange({ yearFrom: localFrom, yearTo }), 500)
	}

	return (
		<div className='filter-sidebar__group filter-sidebar__group--year'>
			<label className='filter-sidebar__label' htmlFor='year-from'>
				From
				<input
					className='filter-sidebar__input'
					id='year-from'
					placeholder='e.g. 2000'
					min='1900'
					max={new Date().getFullYear()}
					value={localFrom}
					onChange={handleFromChange}
					type='number'
				/>
			</label>
			<label className='filter-sidebar__label' htmlFor='year-to'>
				To
				<input
					className='filter-sidebar__input'
					id='year-to'
					placeholder='e.g. 2024'
					min='1900'
					max={new Date().getFullYear()}
					value={localTo}
					onChange={handleToChange}
					type='number'
				/>
			</label>
		</div>
	)
}
