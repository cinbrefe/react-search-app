import { useRef } from 'react'

export default function Search({ onSearch }) {
	const inputRef = useRef()

	function handleSubmit(e) {
		e.preventDefault()
		const query = inputRef.current.value.trim().toLowerCase()

		// Pass the search query to the parent component (lift state up)
		onSearch(query)
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input 
					type="text" 
					placeholder="Search for art..." 
					ref={inputRef} 
				/>
				<button type="submit">Search</button>
			</form>
		</div>
	)
}