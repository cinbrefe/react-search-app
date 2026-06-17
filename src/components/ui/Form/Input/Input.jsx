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
