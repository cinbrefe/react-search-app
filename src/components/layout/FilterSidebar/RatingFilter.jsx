// Props:
//	value (number or '')
//	onChange (function)

import { RATINGS } from '@/constants/filters'

import Radio from '@/components/ui/Form/Radio/Radio'

export default function RatingFilter({ value, onChange }) {
	function handleChange(event) {
		const rating = event.target.value
		onChange(rating === '' ? '' : Number(rating))
	}

	return (
		<div className='filter-sidebar__group' role='radiogroup' aria-label='Minimum rating'>
			<Radio
				name='rating'
				label='Any'
				value=''
				checked={value === ''}
				onChange={handleChange}
			/>
			{RATINGS.map(r => (
				<Radio
					key={r}
					name='rating'
					label={`${r}+`}
					value={r}
					checked={value === r}
					onChange={handleChange}
				/>
			))}
		</div>
	)
}
