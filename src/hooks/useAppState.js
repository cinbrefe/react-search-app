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

	// Merges a partial update (e.g. { genres: [28] }) into the latest filters, so a late update
	// like the debounced year can't overwrite newer ones. FilterSidebar never sends sortBy, so the sort is kept
	function handleFiltersChange(changes) {
		setFilters(prev => ({ ...prev, ...changes }))
	}

	function handleSortChange(value) {
		setFilters(prev => ({ ...prev, sortBy: value }))
	}

	function handleClearSearch() {
		setQuery('')
	}

	return { query, setQuery, filters, handleFiltersChange, selectedId, setSelectedId, handleSortChange, handleClearSearch, statusMessage, setStatusMessage }
}
