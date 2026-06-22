// Props:
//	children (node)
//	title (string)
//	isOpen (boolean, optional)
//	onToggle (function, optional)

import { useState, useId } from 'react'
import { ChevronDown } from 'lucide-react'

import '@/components/ui/Accordion/Accordion.scss'

export default function Accordion({ children, title, isOpen: controlledIsOpen, onToggle }) {
	const [internalIsOpen, setInternalIsOpen] = useState(false)
	const uniqueId = useId()
	const headerId = `accordion-header-${uniqueId}`
	const panelId = `accordion-panel-${uniqueId}`

	// Supports controlled (parent manages isOpen) and uncontrolled (manages own state) modes
	const isControlled = controlledIsOpen !== undefined
	const isOpen = isControlled ? controlledIsOpen : internalIsOpen

	function toggleAccordion() {
		if (isControlled) {
			onToggle()
		} else {
			setInternalIsOpen(prev => !prev)
		}
	}

	return (
		<div className='accordion'>
			<h3>
				<button
					className='accordion__button'
					id={headerId}
					type='button'
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={toggleAccordion}
				>
					{title}
					<span className={`accordion__icon ${isOpen ? 'accordion__icon--open' : ''}`} aria-hidden='true'>
						<ChevronDown className='accordion__icon-svg' />
					</span>
				</button>
			</h3>
			<div
				className='accordion__content'
				id={panelId}
				role='region'
				aria-labelledby={headerId}
				hidden={!isOpen}
			>
				{children}
			</div>
		</div>
	)
}
