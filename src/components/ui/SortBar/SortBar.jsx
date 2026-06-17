import Dropdown from '@/components/ui/Form/Dropdown/Dropdown'
import { SORT_OPTIONS } from '@/constants/filters'

export default function SortBar({ value, onChange }) {
	return (
		<div className='sort-bar'>
			<label htmlFor='sort-by'>
				Sort by:
				<Dropdown id='sort-by' options={SORT_OPTIONS} value={value} onChange={e => onChange(e.target.value)} />
			</label>
		</div>
	)
}
