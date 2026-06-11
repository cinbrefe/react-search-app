export default function Checkbox({ label, checked, onChange }) {
	return (
		<label key={label} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
			<input
				type="checkbox"
				value={label}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	)
}