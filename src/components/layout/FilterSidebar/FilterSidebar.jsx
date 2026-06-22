// Props:
//	onFilter (function)
//	disabled (boolean)
//	onClearSearch (function)

import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

import { INITIAL_FILTERS } from '@/constants/filters'
import Accordion from '@/components/ui/Accordion/Accordion'
import GenreFilter from './GenreFilter'
import RatingFilter from './RatingFilter'
import YearRangeFilter from './YearRangeFilter'
import '@/components/layout/FilterSidebar/FilterSidebar.scss'

export default function FilterSidebar({ onFilter, disabled, onClearSearch }) {
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [activeAccordion, setActiveAccordion] = useState(null)
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < 768)
		}
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	function handleAccordionToggle(id) {
		if (isMobile) {
			setActiveAccordion(prev => prev === id ? null : id)
		}
	}

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
							<RotateCcw className='filter-sidebar__reset-icon' />
						</span>
						Reset Filters
					</button>
				)}
			</div>

			{/* TMDB search and discover are separate endpoints — filters only work with discover, not search */}
			{disabled && (
				<p className='filter-sidebar__disabled-message'>
					Filters are not available while searching.{' '}
					<button className='filter-sidebar__clear-search' onClick={onClearSearch} type='button'>Clear search</button>
				</p>
			)}

			<fieldset className='filter-sidebar__fieldset' disabled={disabled}>
				<legend className='visually-hidden'>Filters</legend>
				<Accordion
					title='Genre'
					isOpen={isMobile ? activeAccordion === 'genre' : undefined}
					onToggle={() => handleAccordionToggle('genre')}
				>
					<GenreFilter
						value={filters.genres}
						onChange={value => handleFilterChange('genres', value)}
					/>
				</Accordion>
				<Accordion
					title='Rating'
					isOpen={isMobile ? activeAccordion === 'rating' : undefined}
					onToggle={() => handleAccordionToggle('rating')}
				>
					<RatingFilter
						value={filters.ratingFilter}
						onChange={value => handleFilterChange('ratingFilter', value)}
					/>
				</Accordion>
				<Accordion
					title='Year Range'
					isOpen={isMobile ? activeAccordion === 'year' : undefined}
					onToggle={() => handleAccordionToggle('year')}
				>
					<YearRangeFilter
						value={{ yearFrom: filters.yearFrom, yearTo: filters.yearTo }}
						onChange={handleYearRangeChange}
					/>
				</Accordion>
			</fieldset>
		</aside>
	)
}
