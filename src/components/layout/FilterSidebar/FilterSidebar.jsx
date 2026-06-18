import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { INITIAL_FILTERS } from '@/constants/filters'
import Accordion from '@/components/ui/Accordion/Accordion'
import GenreFilter from './GenreFilter'
import RatingFilter from './RatingFilter'
import YearRangeFilter from './YearRangeFilter'
import '@/components/layout/FilterSidebar/FilterSidebar.scss'

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
			<div className='filter-sidebar__header'>
				<h2>Filters</h2>
				{hasActiveFilters && (
					<button className='filter-sidebar__reset' onClick={handleResetFilters} type='button'>
						<span className='filter-sidebar__icon' aria-hidden='true'>
							<RotateCcw size={15} />
						</span>
						Reset Filters
						
					</button>
				)}
			</div>

			{disabled && (
				<p>
					Filters are not available while searching.{' '}
					<button onClick={onClearSearch} type='button'>Clear search</button>
				</p>
			)}

			<fieldset disabled={disabled} style={{ border: 'none', padding: 0, margin: 0 }}>
				<legend className='visually-hidden'>Filters</legend>
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
