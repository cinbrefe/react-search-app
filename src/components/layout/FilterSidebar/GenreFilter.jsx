import Checkbox from '@/components/ui/Form/Checkbox/Checkbox'
import { GENRES } from '@/constants/filters'

export default function GenreFilter({ value, onChange }) {
	function handleChange(event) {
		const id = Number(event.target.value)
		const updated = event.target.checked ? [...value, id] : value.filter(g => g !== id)
		onChange(updated)
	}

	return (
		<div className='filter-group'>
			{GENRES.map(genre => (
				<Checkbox
					key={genre.id}
					label={genre.name}
					value={genre.id}
					checked={value.includes(genre.id)}
					onChange={handleChange}
				/>
			))}
		</div>
	)
}
