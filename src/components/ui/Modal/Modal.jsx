import { useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'

import './Modal.scss'

export default function Modal({ children, buttonCaption, isOpen, onClose, label }) {
	const dialog = useRef()
	const descriptionId = useId()

	useEffect(() => {
		if (isOpen) {
			dialog.current.showModal()
		} else if (dialog.current.open) {
			dialog.current.close()
		}
	}, [isOpen])

	return createPortal(
		<dialog ref={dialog} onCancel={onClose} aria-modal='true' aria-label={label} aria-describedby={descriptionId}>
			<div id={descriptionId}>
				{children}
			</div>
			<form method='dialog'>
				<button
					onClick={onClose}
					type='button'
				>
					{buttonCaption}
				</button>
			</form>
		</dialog>,
		document.getElementById('modal')
	)
}
