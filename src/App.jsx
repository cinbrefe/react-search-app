import { useCallback } from 'react'

import { useAppState } from '@/hooks/useAppState'

import CardDetails from '@/components/features/CardDetails/CardDetails'
import CardGrid from '@/components/features/CardGrid/CardGrid'
import FilterSidebar from '@/components/layout/FilterSidebar/FilterSidebar'
import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import Modal from '@/components/ui/Modal/Modal'
import SortBar from '@/components/ui/SortBar/SortBar'

function App() {
	const { query, setQuery, filters, handleFiltersChange, selectedId, setSelectedId, handleSortChange, handleClearSearch, statusMessage, setStatusMessage } = useAppState()
	const handleCloseModal = useCallback(() => setSelectedId(null), [setSelectedId])

	return (
		<div className='app'>
			<ErrorBoundary>
				{selectedId !== null && (
					<Modal onClose={handleCloseModal} label='Movie details'>
						<CardDetails id={selectedId} />
					</Modal>
				)}
				<a href='#site-main' className='skip-link'>Skip to main content</a>
				<Header onSearch={setQuery} query={query} />
				<main id='site-main' className='site-main'>
					<div className='container site-main__container'>
						<FilterSidebar onFilter={handleFiltersChange} disabled={!!query} onClearSearch={handleClearSearch} />
						<div className='site-main__content'>
							<p className='visually-hidden' role='status'>{statusMessage}</p>
							<SortBar value={filters.sortBy} onChange={handleSortChange} disabled={!!query} />
							{/* key forces remount on query/filter change, which resets currentPage to 1 */}
							<CardGrid key={`${query}-${JSON.stringify(filters)}`} query={query} filters={filters} onSelect={setSelectedId} onStatusChange={setStatusMessage} />
						</div>
					</div>
				</main>
				<Footer />
			</ErrorBoundary>
		</div>
	)
}

export default App
