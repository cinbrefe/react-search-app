import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import './Modal.scss'

export default function Modal({ children, buttonCaption, isOpen, onClose }) {
	const dialog = useRef();

	useEffect(() => {
		if (isOpen) {
			dialog.current.showModal();
		} else {
			dialog.current.close();
		}
	}, [isOpen]);

	return createPortal(
		<dialog ref={dialog} onCancel={onClose} className="">
			{children}
			<form method="dialog" className="">
				<button onClick={onClose}>{buttonCaption}</button>
			</form>
		</dialog>,
		document.getElementById('modal')
	);
}