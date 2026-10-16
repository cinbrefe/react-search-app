// Props:
//	value (object: { yearFrom: string, yearTo: string })
//	onChange (function)

import { useRef, useEffect, useState } from 'react'

const MIN_YEAR = 1900
const isFullYear = year => /^\d{4}$/.test(year)

// Returns an error message per input ('' when fine). Years still being typed (under 4 digits) aren't flagged
function getYearErrors(yearFrom, yearTo) {
	const maxYear = new Date().getFullYear()
	const rangeError = `Enter a year from ${MIN_YEAR} to ${maxYear}`
	const outOfRange = year => isFullYear(year) && (Number(year) < MIN_YEAR || Number(year) > maxYear)
	const errors = {
		from: outOfRange(yearFrom) ? rangeError : '',
		to: outOfRange(yearTo) ? rangeError : '',
	}
	if (!errors.from && !errors.to && isFullYear(yearFrom) && isFullYear(yearTo) && Number(yearFrom) > Number(yearTo)) {
		errors.to = '"To" can\'t be earlier than "From"'
	}
	return errors
}

// Only complete, valid years (or empty inputs) are sent as filters
function canApply(yearFrom, yearTo) {
	const errors = getYearErrors(yearFrom, yearTo)
	const completeOrEmpty = year => year === '' || isFullYear(year)
	return completeOrEmpty(yearFrom) && completeOrEmpty(yearTo) && !errors.from && !errors.to
}

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
		if (!canApply(yearFrom, localTo)) return
		debounceRef.current = setTimeout(() => onChange({ yearFrom, yearTo: localTo }), 500)
	}

	function handleToChange(event) {
		const yearTo = event.target.value
		setLocalTo(yearTo)
		clearTimeout(debounceRef.current)
		if (!canApply(localFrom, yearTo)) return
		debounceRef.current = setTimeout(() => onChange({ yearFrom: localFrom, yearTo }), 500)
	}

	const errors = getYearErrors(localFrom, localTo)

	return (
		<div className='filter-sidebar__group filter-sidebar__group--year'>
			<div>
				<label className='filter-sidebar__label' htmlFor='year-from'>
					From
					<input
						className='filter-sidebar__input'
						id='year-from'
						placeholder='e.g. 2000'
						min={MIN_YEAR}
						max={new Date().getFullYear()}
						value={localFrom}
						onChange={handleFromChange}
						type='number'
						aria-invalid={!!errors.from}
						aria-describedby={errors.from ? 'year-from-error' : undefined}
					/>
				</label>
				<p className='filter-sidebar__error' id='year-from-error' aria-live='polite'>{errors.from}</p>
			</div>
			<div>
				<label className='filter-sidebar__label' htmlFor='year-to'>
					To
					<input
						className='filter-sidebar__input'
						id='year-to'
						placeholder='e.g. 2024'
						min={MIN_YEAR}
						max={new Date().getFullYear()}
						value={localTo}
						onChange={handleToChange}
						type='number'
						aria-invalid={!!errors.to}
						aria-describedby={errors.to ? 'year-to-error' : undefined}
					/>
				</label>
				<p className='filter-sidebar__error' id='year-to-error' aria-live='polite'>{errors.to}</p>
			</div>
		</div>
	)
}
