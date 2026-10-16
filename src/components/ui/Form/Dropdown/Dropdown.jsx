// Props:
//	id (string)
//	options (array of { value: string or number, label: string })
//	value (string or number)
//	onChange (function)
//	disabled (boolean, optional)

import '@/components/ui/Form/Dropdown/Dropdown.scss'

export default function Dropdown({ id, options, value, onChange, disabled = false }) {
	return (
		<select className='dropdown' id={id} value={value} onChange={onChange} disabled={disabled}>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	)
}
