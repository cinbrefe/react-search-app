import { useAppState } from '@/hooks/useAppState'

import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import Header from '@/components/layout/Header/Header'
import SortBar from '@/components/ui/SortBar/SortBar'
import FilterSidebar from '@/components/layout/FilterSidebar/FilterSidebar'
import CardGrid from '@/components/features/CardGrid/CardGrid'
import Modal from '@/components/ui/Modal/Modal'
import CardDetails from '@/components/features/CardDetails/CardDetails'

function App() {
	const { query, setQuery, filters, setFilters, selectedId, setSelectedId, handleSortChange, handleClearSearch } = useAppState()

	return (
		<ErrorBoundary>
			<Modal isOpen={selectedId !== null} onClose={() => setSelectedId(null)} buttonCaption='Close'>
				<CardDetails id={selectedId} />
			</Modal>
			<Header onSearch={setQuery} />
			<main>
				<div style={{ display: 'flex' }}>
					<FilterSidebar onFilter={setFilters} disabled={!!query} onClearSearch={handleClearSearch} />
					<div>
						<SortBar value={filters.sortBy} onChange={handleSortChange} />
						<CardGrid key={`${query}-${JSON.stringify(filters)}`} query={query} filters={filters} onSelect={setSelectedId} />
					</div>
				</div>
			</main>
		</ErrorBoundary>
	)
}

export default App
