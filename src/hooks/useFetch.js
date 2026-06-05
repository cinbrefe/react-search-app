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
		if (!url) {
			dispatch({ type: 'FETCH_START' })
			return
		}
		dispatch({ type: 'FETCH_START' })
		fetch(url)
			.then(res => res.json())
			.then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
			.catch(err => dispatch({ type: 'FETCH_ERROR', payload: err }))
	}, [url])

	return state
}

export default useFetch
