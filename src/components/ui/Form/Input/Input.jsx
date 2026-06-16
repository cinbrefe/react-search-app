export default function Input({ type = 'text', value, onChange, placeholder, ref }) {
	return (
		<input
			ref={ref}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	)
}