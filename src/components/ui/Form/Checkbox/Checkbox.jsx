import '@/components/ui/Form/Checkbox/Checkbox.scss';

export default function Checkbox({ label, value, checked, onChange }) {
	const id = `checkbox-${value}`
	return (
		<label htmlFor={id} className='checkbox__label'>
			<input
				className='checkbox'
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
