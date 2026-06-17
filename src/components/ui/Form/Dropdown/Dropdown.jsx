export default function Dropdown({ id, options, value, onChange }) {
	return (
		<select id={id} value={value} onChange={onChange}>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	)
}
