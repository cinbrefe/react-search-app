export default function Checkbox({ label, value, checked, onChange }) {
	const id = `checkbox-${value}`
	return (
		<label htmlFor={id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
			<input
				id={id}
				type='checkbox'
				value={value ?? label}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	)
}
