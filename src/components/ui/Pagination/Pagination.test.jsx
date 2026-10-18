import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '@/components/ui/Pagination/Pagination'

describe('Pagination', () => {
	it('goes to the next page', async () => {
		const user = userEvent.setup()
		const onPageChange = vi.fn()
		render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />)

		await user.click(screen.getByRole('button', { name: 'Go to next page' }))

		expect(onPageChange).toHaveBeenCalledWith(4)
	})

	it('disables the previous page button on the first page', () => {
		const onPageChange = vi.fn()
		render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />)

		expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
	})

	it('marks the current page', () => {
		const onPageChange = vi.fn()
		render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />)

		expect(screen.getByRole('button', { name: 'Page 3, current page' })).toHaveAttribute('aria-current', 'page')
	})

	it('goes to the page number that is clicked', async () => {
		const user = userEvent.setup()
		const onPageChange = vi.fn()
		render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />)

		await user.click(screen.getByRole('button', { name: 'Go to page 5' }))

		expect(onPageChange).toHaveBeenCalledWith(5)
	})
})
