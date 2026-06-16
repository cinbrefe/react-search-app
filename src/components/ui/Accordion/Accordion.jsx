import { useState } from 'react'

export default function Accordion({ children, title }) {
	const [isOpen, setIsOpen] = useState(false)

	function toggleAccordion() {
		setIsOpen(prev => !prev)
	}

	return (
		<div className="accordion">
			<button onClick={toggleAccordion}>{title}</button>
			{isOpen && children}
		</div>
	)
}