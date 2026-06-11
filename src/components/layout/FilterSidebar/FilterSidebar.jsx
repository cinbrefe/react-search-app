import { useState } from 'react'
import Checkbox from '../../ui/Checkbox/Checkbox'

const ARTWORK_TYPES = [
	'Painting', 'Sculpture', 'Photograph', 'Print',
	'Drawing and Watercolor', 'Textile', 'Metalwork',
	'Decorative Arts', 'Glass', 'Mixed Media'
]

const PLACES_OF_ORIGIN = [
	'France', 'United States', 'Italy', 'Netherlands',
	'Spain', 'England', 'Japan', 'China', 'Egypt',
	'Austria', 'Belgium', 'India', 'Russia', 'Brazil'
]

export default function FilterSidebar({ onFilter }) {
	const [typeFilter, setTypeFilter] = useState([])
	const [placeFilter, setPlaceFilter] = useState([])
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')

	function handleTypeChange(event) {
		const { value, checked } = event.target
		const updated = checked ? [...typeFilter, value] : typeFilter.filter(t => t !== value)
		setTypeFilter(updated)
		onFilter({ artwork_type_title: updated, place_of_origin: placeFilter, dateFrom, dateTo })
	}

	function handlePlaceChange(event) {
		const { value, checked } = event.target
		const updated = checked ? [...placeFilter, value] : placeFilter.filter(p => p !== value)
		setPlaceFilter(updated)
		onFilter({ artwork_type_title: typeFilter, place_of_origin: updated, dateFrom, dateTo })
	}

	function handleDateFromChange(event) {
		setDateFrom(event.target.value)
		onFilter({ artwork_type_title: typeFilter, place_of_origin: placeFilter, dateFrom: event.target.value, dateTo })
	}

	function handleDateToChange(event) {
		setDateTo(event.target.value)
		onFilter({ artwork_type_title: typeFilter, place_of_origin: placeFilter, dateFrom, dateTo: event.target.value })
	}

	return (
		<aside className="filter-sidebar">
			<h2>Filters</h2>

			<div className="filter-group">
				<h3>Artwork Type</h3>
				<form>
					{ARTWORK_TYPES.map(type => (
						<Checkbox
							key={type}
							label={type}
							checked={typeFilter.includes(type)}
							onChange={handleTypeChange}
						/>
					))}
				</form>
			</div>

			<div className="filter-group">
				<h3>Place of Origin</h3>
				<form>
					{PLACES_OF_ORIGIN.map(place => (
						<Checkbox
							key={place}
							label={place}
							checked={placeFilter.includes(place)}
							onChange={handlePlaceChange}
						/>
					))}
				</form>
			</div>

			<div className="filter-group">
				<h3>Date Range</h3>
				<label>
					From
					<input type="number" placeholder="e.g. 1800" value={dateFrom} onChange={handleDateFromChange} />
				</label>
				<label>
					To
					<input type="number" placeholder="e.g. 1900" value={dateTo} onChange={handleDateToChange} />
				</label>
			</div>
		</aside>
	)
}
