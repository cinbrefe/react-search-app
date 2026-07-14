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

	useEffect(() => {
		const el = dialog.current
		const handleBackdropClick = (e) => { if (e.target === el) onClose() }

		el.showModal()
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
			onCancel={onClose}
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
