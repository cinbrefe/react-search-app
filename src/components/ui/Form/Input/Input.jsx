// Props:
//	id (string)
//	type (string, optional, default: 'text')
//	value (string or number)
//	onChange (function)
//	placeholder (string, optional)
//	ref (React ref, optional)

import '@/components/ui/Form/Input/Input.scss'

export default function Input({ id, type = 'text', value, onChange, placeholder, ref }) {
	return (
		<input
			id={id}
			ref={ref}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	)
}
