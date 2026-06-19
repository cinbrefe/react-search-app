import '@/components/ui/Form/Dropdown/Dropdown.scss'

export default function Dropdown({ id, options, value, onChange }) {
	return (
		<select className='dropdown' id={id} value={value} onChange={onChange}>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	)
}
