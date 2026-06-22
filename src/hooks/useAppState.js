// Returns:
//	query (string), setQuery (function)
//	filters (object), setFilters (function)
//	selectedId (number | null), setSelectedId (function)
//	handleSortChange (function)
//	handleClearSearch (function)

import { useState } from 'react'
import { INITIAL_FILTERS } from '@/constants/filters'

export function useAppState() {
	const [query, setQuery] = useState('')
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [selectedId, setSelectedId] = useState(null)

	function handleSortChange(value) {
		setFilters(prev => ({ ...prev, sortBy: value }))
	}

	function handleClearSearch() {
		setQuery('')
	}

	return { query, setQuery, filters, setFilters, selectedId, setSelectedId, handleSortChange, handleClearSearch }
}
