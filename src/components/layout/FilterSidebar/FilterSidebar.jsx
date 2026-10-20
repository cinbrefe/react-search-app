// Props:
//	onFilter (function) — receives only the changed fields, e.g. { genres: [28] }
//	disabled (boolean)
//	onClearSearch (function)
//	filters (object)

import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

import { INITIAL_FILTERS } from '@/constants/filters'
import Accordion from '@/components/ui/Accordion/Accordion'
import GenreFilter from './GenreFilter'
import RatingFilter from './RatingFilter'
import YearRangeFilter from './YearRangeFilter'
import '@/components/layout/FilterSidebar/FilterSidebar.scss'

export default function FilterSidebar({ onFilter, disabled, onClearSearch, filters }) {
	const [activeAccordion, setActiveAccordion] = useState(null)
	const [resetCount, setResetCount] = useState(0)
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
		onFilter({ [key]: value })
	}

	function handleYearRangeChange({ yearFrom, yearTo }) {
		onFilter({ yearFrom, yearTo })
	}

	function handleResetFilters() {
		// Sort isn't a filter, so it's left as is
		onFilter({ genres: [], ratingFilter: '', yearFrom: '', yearTo: '' })
		// Remounts YearRangeFilter: cancels a pending year update and clears a year that was never applied (e.g. an invalid 1800)
		setResetCount(count => count + 1)
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
					Filters and sorting are not available while searching.{' '}
					<button className='filter-sidebar__clear-search' onClick={onClearSearch} type='button'>Clear search</button>
				</p>
			)}

			<fieldset className='filter-sidebar__fieldset' disabled={disabled}>
				<legend className='visually-hidden'>Filters</legend>
				<Accordion
					title='Genre'
					isOpen={isMobile ? activeAccordion === 'genre' : undefined}
					onToggle={() => handleAccordionToggle('genre')}
					defaultOpen
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
					defaultOpen
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
					defaultOpen
				>
					<YearRangeFilter
						key={resetCount}
						value={{ yearFrom: filters.yearFrom, yearTo: filters.yearTo }}
						onChange={handleYearRangeChange}
					/>
				</Accordion>
			</fieldset>
		</aside>
	)
}
