import { useRef } from 'react'

import Input from '@/components/ui/Form/Input/Input'

export default function Search({ onSearch }) {
	const inputRef = useRef()

	function handleSubmit(e) {
		e.preventDefault()
		const query = inputRef.current.value.trim()
		onSearch(query)
		inputRef.current.value = ''
	}

	return (
		<form onSubmit={handleSubmit}>
			<Input
				type="text"
				placeholder="Search for movies..."
				ref={inputRef}
			/>
			<button type="submit">Search</button>
		</form>
	)
}