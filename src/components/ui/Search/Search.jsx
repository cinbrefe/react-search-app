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
		 	<label htmlFor='search-input' className='visually-hidden'>Search movies</label>  
			<Input
				id='search-input'
				placeholder='Search for movies...'
				ref={inputRef}
				type='text'
			/>
			<button type='submit'>Search</button>
		</form>
	)
}
