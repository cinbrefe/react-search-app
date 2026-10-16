// Props:
//	value (string or number)
//	onChange (function)
//	disabled (boolean, optional) — true while searching, since search results can't be sorted

import { SORT_OPTIONS } from '@/constants/filters'

import Dropdown from '@/components/ui/Form/Dropdown/Dropdown'
import '@/components/ui/SortBar/SortBar.scss'

export default function SortBar({ value, onChange, disabled = false }) {
	return (
		<div className='sort-bar'>
			<label className='sort-bar__label' htmlFor='sort-by'>
				Sort by:
				<Dropdown id='sort-by' options={SORT_OPTIONS} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} />
			</label>
		</div>
	)
}
