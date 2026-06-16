import { useState } from 'react'

import Header from './components/layout/Header/Header'
import Search from './components/ui/Search/Search'
import FilterSidebar from './components/layout/FilterSidebar/FilterSidebar'
import CardGrid from './components/features/CardGrid/CardGrid'
import Modal from './components/ui/Modal/Modal'
import CardDetails from './components/features/CardDetails/CardDetails'

function App() {
	const [query, setQuery] = useState('')
	const [filters, setFilters] = useState({})
	const [selectedId, setSelectedId] = useState(null)

	function handleSelect(id) {
		setSelectedId(id)
	}

	return (
		<>
			<Modal isOpen={selectedId !== null} onClose={() => setSelectedId(null)} buttonCaption="Close">
				<CardDetails id={selectedId} />
			</Modal>
			<Header />
			<main>
				<Search onSearch={setQuery} />
				<div style={{ display: 'flex' }}>
					<FilterSidebar onFilter={setFilters} disabled={!!query} onClearSearch={() => setQuery('')} />
					<CardGrid query={query} filters={filters} onSelect={handleSelect} />
				</div>
			</main>
		</>
	)
}

export default App
