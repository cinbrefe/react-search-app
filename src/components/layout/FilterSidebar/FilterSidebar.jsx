import { useState } from 'react'
import Accordion from '@/components/ui/Accordion/Accordion'
import GenreFilter from './GenreFilter'
import RatingFilter from './RatingFilter'
import YearRangeFilter from './YearRangeFilter'
import { INITIAL_FILTERS } from '@/constants/filters'

export default function FilterSidebar({ onFilter, disabled, onClearSearch }) {
	const [filters, setFilters] = useState(INITIAL_FILTERS)

	function handleFilterChange(key, value) {
		const updated = { ...filters, [key]: value }
		setFilters(updated)
		onFilter(updated)
	}

	function handleYearRangeChange({ yearFrom, yearTo }) {
		const updated = { ...filters, yearFrom, yearTo }
		setFilters(updated)
		onFilter(updated)
	}

	function handleResetFilters() {
		setFilters(INITIAL_FILTERS)
		onFilter(INITIAL_FILTERS)
	}

	const hasActiveFilters =
		filters.genres.length > 0 ||
		filters.ratingFilter !== INITIAL_FILTERS.ratingFilter ||
		filters.yearFrom !== INITIAL_FILTERS.yearFrom ||
		filters.yearTo !== INITIAL_FILTERS.yearTo

	return (
		<aside className='filter-sidebar'>
			<h2>Filters</h2>
			{disabled && (
				<p>
					Filters are not available while searching.{' '}
					<button onClick={onClearSearch} type='button'>Clear search</button>
				</p>
			)}

			<fieldset disabled={disabled} style={{ border: 'none', padding: 0, margin: 0 }}>
				{hasActiveFilters && (
					<button type='button' onClick={handleResetFilters}>
						Reset Filters
					</button>
				)}
				<Accordion title='Genre'>
					<GenreFilter
						value={filters.genres}
						onChange={value => handleFilterChange('genres', value)}
					/>
				</Accordion>
				<Accordion title='Rating'>
					<RatingFilter
						value={filters.ratingFilter}
						onChange={value => handleFilterChange('ratingFilter', value)}
					/>
				</Accordion>
				<Accordion title='Year Range'>
					<YearRangeFilter
						value={{ yearFrom: filters.yearFrom, yearTo: filters.yearTo }}
						onChange={handleYearRangeChange}
					/>
				</Accordion>
			</fieldset>
		</aside>
	)
}
