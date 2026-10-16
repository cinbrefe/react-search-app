// Returns:
//	query (string), setQuery (function)
//	filters (object), handleFiltersChange (function)
//	selectedId (number | null), setSelectedId (function)
//	handleSortChange (function)
//	handleClearSearch (function)
//	statusMessage (string), setStatusMessage (function) — announced to screen readers

import { useState } from 'react'
import { INITIAL_FILTERS } from '@/constants/filters'

export function useAppState() {
	const [query, setQuery] = useState('')
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [selectedId, setSelectedId] = useState(null)
	const [statusMessage, setStatusMessage] = useState('')

	// FilterSidebar sends its whole filters object, which never tracks sortBy — keep the current sort
	function handleFiltersChange(sidebarFilters) {
		setFilters(prev => ({ ...sidebarFilters, sortBy: prev.sortBy }))
	}

	function handleSortChange(value) {
		setFilters(prev => ({ ...prev, sortBy: value }))
	}

	function handleClearSearch() {
		setQuery('')
	}

	return { query, setQuery, filters, handleFiltersChange, selectedId, setSelectedId, handleSortChange, handleClearSearch, statusMessage, setStatusMessage }
}
