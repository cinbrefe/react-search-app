// Params:
//	url (string | null) — pass null to skip the fetch
// Returns:
//	data (object | null)
//	loading (boolean)
//	error (Error | null)

import { useReducer, useEffect } from 'react'

const initialState = { data: null, loading: false, error: null }

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_START':   return { data: null, loading: true, error: null }
		case 'FETCH_SUCCESS': return { data: action.payload, loading: false, error: null }
		case 'FETCH_ERROR':   return { data: null, loading: false, error: action.payload }
		default: return state
	}
}

const useFetch = (url) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	useEffect(() => {
		if (!url) return // allows callers to conditionally skip fetching by passing null
		const controller = new AbortController() // cancels the request if url changes or component unmounts
		dispatch({ type: 'FETCH_START' })
		fetch(url, { signal: controller.signal })
			.then(res => {
				if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
				return res.json()
			})
			.then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
			.catch(err => {
				if (err.name === 'AbortError') return // ignore intentional cancellations
				dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err : new Error(String(err)) })
			})
		return () => controller.abort()
	}, [url])

	return state
}

export default useFetch
