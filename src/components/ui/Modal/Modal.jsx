import { useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import '@/components/ui/Modal/Modal.scss'

export default function Modal({ children, isOpen, onClose, label }) {
	const dialog = useRef()
	const descriptionId = useId()

	useEffect(() => {
		if (isOpen) {
			dialog.current.showModal()
			document.body.style.overflow = 'hidden'
		} else if (dialog.current.open) {
			dialog.current.close()
			document.body.style.overflow = ''
		}
	}, [isOpen])

	return createPortal(
		<dialog
			className='modal'
			aria-modal='true'
			aria-label={label}
			aria-describedby={descriptionId}
			onCancel={onClose}
			onClick={e => { if (e.target === dialog.current) onClose() }}
			ref={dialog}
		>
			<button
				className='modal__close'
				aria-label='Close'
				onClick={onClose}
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
