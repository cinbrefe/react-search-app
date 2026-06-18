import { useState, useId } from 'react'
import '@/components/ui/Accordion/Accordion.scss'
import { ChevronDown } from 'lucide-react'  

export default function Accordion({ children, title }) {
	const [isOpen, setIsOpen] = useState(false)
	const uniqueId = useId()
	const headerId = `accordion-header-${uniqueId}`
	const panelId = `accordion-panel-${uniqueId}`

	function toggleAccordion() {
		setIsOpen(prev => !prev)
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
						 <ChevronDown size={20} />
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
