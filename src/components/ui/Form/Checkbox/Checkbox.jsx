export default function Checkbox({ label, value, checked, onChange }) {
	return (
		<label key={label} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
			<input
				type='checkbox'
				value={value ?? label}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	)
}
