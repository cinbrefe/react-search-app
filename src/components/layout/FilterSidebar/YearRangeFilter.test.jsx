import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import YearRangeFilter from '@/components/layout/FilterSidebar/YearRangeFilter'

describe('YearRangeFilter', () => {
	it('flags and describes a year out of range', async () => {
		const user = userEvent.setup()
		const onYearChange = vi.fn()
		const maxYear = new Date().getFullYear()
		render(<YearRangeFilter value={{ yearFrom: '', yearTo: '' }} onChange={onYearChange} />)
		const fromInput = screen.getByRole('spinbutton', { name: 'From' })

		await user.type(fromInput, '1800')

		expect(fromInput).toHaveAttribute('aria-invalid', 'true')
		expect(fromInput).toHaveAccessibleDescription(`Enter a year from 1900 to ${maxYear}`)
	})

	it('flags and describes a "To" year earlier than "From"', async () => {
		const user = userEvent.setup()
		const onYearChange = vi.fn()
		render(<YearRangeFilter value={{ yearFrom: '', yearTo: '' }} onChange={onYearChange} />)
		const fromInput = screen.getByRole('spinbutton', { name: 'From' })
		const toInput = screen.getByRole('spinbutton', { name: 'To' })

		await user.type(fromInput, '2010')
		await user.type(toInput, '2000')

		expect(toInput).toHaveAttribute('aria-invalid', 'true')
		expect(toInput).toHaveAccessibleDescription(`"To" can't be earlier than "From"`)
	})

	it('applies a valid year', async () => {
		const user = userEvent.setup()
		const onYearChange = vi.fn()
		render(<YearRangeFilter value={{ yearFrom: '', yearTo: '' }} onChange={onYearChange} />)
		const fromInput = screen.getByRole('spinbutton', { name: 'From' })

		await user.type(fromInput, '2000')
		await waitFor(() => expect(onYearChange).toHaveBeenCalledWith({ yearFrom: '2000', yearTo: '' }))

		expect(fromInput).not.toHaveAttribute('aria-invalid', 'true')
	})
})