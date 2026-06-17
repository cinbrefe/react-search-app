import { useAppState } from '@/hooks/useAppState'

import Header from '@/components/layout/Header/Header'
import Search from '@/components/ui/Search/Search'
import SortBar from '@/components/ui/SortBar/SortBar'
import FilterSidebar from '@/components/layout/FilterSidebar/FilterSidebar'
import CardGrid from '@/components/features/CardGrid/CardGrid'
import Modal from '@/components/ui/Modal/Modal'
import CardDetails from '@/components/features/CardDetails/CardDetails'

function App() {
	const { query, setQuery, filters, setFilters, selectedId, setSelectedId, handleSortChange, handleClearSearch } = useAppState()

	return (
		<>
			<Modal isOpen={selectedId !== null} onClose={() => setSelectedId(null)} buttonCaption='Close'>
				<CardDetails id={selectedId} />
			</Modal>
			<Header />
			<main>
				<Search onSearch={setQuery} />
				<SortBar value={filters.sortBy} onChange={handleSortChange} />
				<div style={{ display: 'flex' }}>
					<FilterSidebar onFilter={setFilters} disabled={!!query} onClearSearch={handleClearSearch} />
					<CardGrid query={query} filters={filters} onSelect={setSelectedId} />
				</div>
			</main>
		</>
	)
}

export default App
