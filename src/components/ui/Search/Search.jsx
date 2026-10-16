// Props:
//	onSearch (function)
//	query (string, optional)

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'

import Input from '@/components/ui/Form/Input/Input'
import '@/components/ui/Search/Search.scss'

export default function Search({ onSearch, query = '' }) {
	const [text, setText] = useState(query)
	const [prevQuery, setPrevQuery] = useState(query)

	if (query !== prevQuery) {
		setPrevQuery(query)
		setText(query)
	}

	function handleInputChange(e) {
		setText(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		onSearch(text.trim())
	}

	return (
		<form className='search-form' onSubmit={handleSubmit} role="search">
			<div className='search-form__group'>
				<label htmlFor='search-input' className='visually-hidden'>Search movies</label>
				<Input
					id='search-input'
					placeholder='Search for movies...'
					type='text'
					value={text}
					onChange={handleInputChange}
				/>
				<button className='search-form__button' type='submit' aria-label='Search'><SearchIcon className='search-form__icon' /></button>
			</div>
		</form>
	)
}
