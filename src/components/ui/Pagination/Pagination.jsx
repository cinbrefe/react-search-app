// Props:
//	currentPage (number)
//	totalPages (number)
//	onPageChange (function)

import { ChevronLeft, ChevronRight } from 'lucide-react'
import '@/components/ui/Pagination/Pagination.scss'

export default function Pagination({ currentPage, totalPages, onPageChange }) {

	const canGoPrev = currentPage > 1
	const canGoNext = currentPage < totalPages
	const canJumpForward = currentPage + 5 <= totalPages

	// Up to 5 page numbers: 1–5 on the first pages, then the 4 before the current page plus the current one
	function buildPageList() {
		const start = Math.max(1, currentPage - 4)
		const end = Math.min(start + 4, totalPages)
		const pages = []
		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
		return pages
	}

	function handlePrev() { onPageChange(currentPage - 1) }
	function handleNext() { onPageChange(currentPage + 1) }
	function handleJumpForward() { onPageChange(currentPage + 5) }

	return (
		<nav aria-label='Pagination' className='pagination'>
			<button
				aria-label='Go to previous page'
				className='pagination__btn pagination__btn--prev'
				disabled={!canGoPrev}
				onClick={handlePrev}
				type='button'
			>
				<ChevronLeft className='pagination__icon' />
			</button>

			{buildPageList().map(page => (
				<button
					key={page}
					className={`pagination__btn pagination__btn--page ${page === currentPage ? 'pagination__btn--active' : ''}`}
					type='button'
					disabled={page === currentPage}
					aria-label={page === currentPage ? `Page ${page}, current page` : `Go to page ${page}`}
					aria-current={page === currentPage ? 'page' : undefined}
					onClick={() => onPageChange(page)}
				>
					{page}
				</button>
			))}

			<button
				className='pagination__btn pagination__btn--jump'
				type='button'
				aria-label='Jump forward 5 pages'
				onClick={handleJumpForward}
				disabled={!canJumpForward}
			>
				...
			</button>

			<button
				className='pagination__btn pagination__btn--next'
				aria-label='Go to next page'
				disabled={!canGoNext}
				onClick={handleNext}
				type='button'
			>
				<ChevronRight className='pagination__icon' />
			</button>
		</nav>
	)
}
