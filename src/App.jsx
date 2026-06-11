import { useState } from 'react'

import Header from './components/layout/Header/Header'
import Search from './components/Search/Search'
import FilterSidebar from './components/layout/FilterSidebar/FilterSidebar'
import CardGrid from './components/CardGrid/CardGrid'
import Modal from './components/ui/Modal/Modal'
import ArtworkDetails from './components/ArtworkDetails/ArtworkDetails'

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
				<ArtworkDetails id={selectedId} />
			</Modal>
			<Header />
			<main>
				<Search onSearch={setQuery} />
				<div style={{ display: 'flex' }}>
					<FilterSidebar onFilter={setFilters} />
					<CardGrid query={query} filters={filters} onSelect={handleSelect} />
				</div>
			</main>
		</>
	)
}

export default App
