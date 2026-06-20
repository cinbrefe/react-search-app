import { useRef } from 'react'
import { Search as SearchIcon } from 'lucide-react'

import Input from '@/components/ui/Form/Input/Input'
import '@/components/ui/Search/Search.scss'

export default function Search({ onSearch }) {
	const inputRef = useRef()

	function handleSubmit(e) {
		e.preventDefault()
		const query = inputRef.current.value.trim()
		onSearch(query)
		inputRef.current.value = ''
	}

	return (
		<form className='search-form' onSubmit={handleSubmit} role="search">
			<div className='search-form__group'>
				<label htmlFor='search-input' className='visually-hidden'>Search movies</label>  
				<Input
					id='search-input'
					placeholder='Search for movies...'
					ref={inputRef}
					type='text'
				/>
				<button className='search-form__button' type='submit'><SearchIcon className='search-form__icon' /></button>
			</div>
		</form>
	)
}
