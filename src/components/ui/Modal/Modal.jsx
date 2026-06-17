import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

export default function Modal({ children, buttonCaption, isOpen, onClose }) {
	const dialog = useRef()

	useEffect(() => {
		if (isOpen) {
			dialog.current.showModal()
		} else if (dialog.current.open) {
			dialog.current.close()
		}
	}, [isOpen])

	return createPortal(
		<dialog ref={dialog} onCancel={onClose}>
			{children}
			<form method='dialog'>
				<button onClick={onClose}>{buttonCaption}</button>
			</form>
		</dialog>,
		document.getElementById('modal')
	)
}
