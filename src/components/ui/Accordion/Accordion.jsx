import { useState, useId } from 'react'

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
					id={headerId}
					type='button'
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={toggleAccordion}
				>
					{title}
					<span aria-hidden='true'>
						▼
					</span>
				</button>
			</h3>
			<div
				id={panelId}
				role='region'
				aria-labelledby={headerId}
				hidden={!isOpen}
				className='accordion-content'
			>
				{children}
			</div>
		</div>
	)
}
