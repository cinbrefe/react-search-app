import { useState } from 'react'

export function useAppState() {
	const [query, setQuery] = useState('')
	const [filters, setFilters] = useState({ sortBy: 'popularity.desc' })
	const [selectedId, setSelectedId] = useState(null)

	function handleSortChange(value) {
		setFilters(prev => ({ ...prev, sortBy: value }))
	}

	function handleClearSearch() {
		setQuery('')
	}

	return { query, setQuery, filters, setFilters, selectedId, setSelectedId, handleSortChange, handleClearSearch }
}
