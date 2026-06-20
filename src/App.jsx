import { useAppState } from '@/hooks/useAppState'

import CardDetails from '@/components/features/CardDetails/CardDetails'
import CardGrid from '@/components/features/CardGrid/CardGrid'
import FilterSidebar from '@/components/layout/FilterSidebar/FilterSidebar'
import Header from '@/components/layout/Header/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import Modal from '@/components/ui/Modal/Modal'
import SortBar from '@/components/ui/SortBar/SortBar'

function App() {
	const { query, setQuery, filters, setFilters, selectedId, setSelectedId, handleSortChange, handleClearSearch } = useAppState()

	return (
		<div className='app'>
			<ErrorBoundary>
				<Modal isOpen={selectedId !== null} onClose={() => setSelectedId(null)} label='Movie details'>
					<CardDetails id={selectedId} />
				</Modal>
				<a href='#site-main' className='skip-link'>Skip to main content</a>
				<Header onSearch={setQuery} />
				<main id='site-main' className='site-main'>
					<div className='container site-main__container'>
						<FilterSidebar onFilter={setFilters} disabled={!!query} onClearSearch={handleClearSearch} />
						<div className='site-main__content'>
							<SortBar value={filters.sortBy} onChange={handleSortChange} />
							<CardGrid key={`${query}-${JSON.stringify(filters)}`} query={query} filters={filters} onSelect={setSelectedId} />
						</div>
					</div>
				</main>
			</ErrorBoundary>
		</div>
	)
}

export default App
