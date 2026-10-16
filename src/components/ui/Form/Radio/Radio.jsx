// Props:
//	name (string) — shared by every radio in the group
//	label (string)
//	value (string or number)
//	checked (boolean)
//	onChange (function)

import '@/components/ui/Form/Radio/Radio.scss'

export default function Radio({ name, label, value, checked, onChange }) {
	const id = `radio-${name}-${value === '' ? 'any' : value}`
	return (
		<label htmlFor={id} className='radio__label'>
			<input
				className='radio'
				id={id}
				name={name}
				type='radio'
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	)
}
