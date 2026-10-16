// Props:
//	children (node)
//	onClose (function)
//	label (string)

import { useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import '@/components/ui/Modal/Modal.scss'

export default function Modal({ children, onClose, label }) {
	const dialog = useRef()
	const descriptionId = useId()

	// The dialog's own close event is the only thing that tells React it closed. Escape, the close
	// button and backdrop clicks all close the dialog natively, so React state can't get out of sync
	// (browsers don't always fire cancel on Escape, but close always fires)
	function closeDialog() {
		dialog.current.close()
	}

	useEffect(() => {
		const el = dialog.current
		const handleBackdropClick = (e) => { if (e.target === el) el.close() }

		if (!el.open) el.showModal()
		document.body.style.overflow = 'hidden'
		el.addEventListener('click', handleBackdropClick)

		return () => {
			el.removeEventListener('click', handleBackdropClick)
			document.body.style.overflow = ''
		}
	}, [onClose])

	return createPortal(
		<dialog
			className='modal'
			aria-modal='true'
			aria-label={label}
			aria-describedby={descriptionId}
			onClose={onClose}
			ref={dialog}
		>
			<button
				className='modal__close'
				aria-label='Close'
				onClick={closeDialog}
				type='button'
			>
				<X className='modal__close-icon' />
			</button>
			<div className='modal__content' id={descriptionId}>
				{children}
			</div>
		</dialog>,
		document.getElementById('modal')
	)
}
