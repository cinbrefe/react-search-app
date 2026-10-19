import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// jsdom doesn't implement <dialog>'s showModal() and close(), so stand in for them.
// close() also fires the close event, which Modal listens to
HTMLDialogElement.prototype.showModal = function () {
	this.open = true
}
HTMLDialogElement.prototype.close = function () {
	this.open = false
	this.dispatchEvent(new Event('close'))
}
