import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RatingFilter from '@/components/layout/FilterSidebar/RatingFilter'

describe('RatingFilter', () => {
	it('selects "Any" when no rating is set', () => {
		const onRatingChange = vi.fn()
		render(<RatingFilter value='' onChange={onRatingChange} />)

		expect(screen.getByRole('radio', { name: 'Any' })).toBeChecked()
	})

	it('sends the picked rating as a number', async () => {
		const user = userEvent.setup()
		const onRatingChange = vi.fn()
		render(<RatingFilter value='' onChange={onRatingChange} />)

		await user.click(screen.getByRole('radio', { name: '7+' }))

		expect(onRatingChange).toHaveBeenCalledWith(7)
	})

	it('clears the rating when "Any" is picked', async () => {
		const user = userEvent.setup()
		const onRatingChange = vi.fn()
		render(<RatingFilter value={7} onChange={onRatingChange} />)

		await user.click(screen.getByRole('radio', { name: 'Any' }))

		expect(onRatingChange).toHaveBeenCalledWith('')
	})

	it('groups the options under a "Minimum rating" label', () => {
		const onRatingChange = vi.fn()
		render(<RatingFilter value='' onChange={onRatingChange} />)

		expect(screen.getByRole('radiogroup', { name: 'Minimum rating' })).toBeInTheDocument()
	})
})
