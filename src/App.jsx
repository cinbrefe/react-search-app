import { useState } from 'react'

import Header from './components/Header/Header'
import Search from './components/Search/Search'
import CardGrid from './components/CardGrid/CardGrid'
import Modal from './components/ui/Modal'
import ArtworkDetails from './components/ArtworkDetails/ArtworkDetails'

function App() {
	const [query, setQuery] = useState('')
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
				<CardGrid query={query} onSelect={handleSelect} />
			</main>
		</>
	)
}

export default App
