// Props:
//	value (number)
//	onChange (function)

import { RATINGS } from '@/constants/filters'

import Checkbox from '@/components/ui/Form/Checkbox/Checkbox'

export default function RatingFilter({ value, onChange }) {
	function handleChange(event) {
		const rating = Number(event.target.value)
		onChange(event.target.checked ? rating : '')
	}

	return (
		<div className='filter-sidebar__group' role='group' aria-label='Rating'>
			{RATINGS.map(r => (
				<Checkbox
					key={r}
					label={`${r}+`}
					value={r}
					checked={value === r}
					onChange={handleChange}
				/>
			))}
		</div>
	)
}
