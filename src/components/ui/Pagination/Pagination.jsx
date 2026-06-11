// Windowed pagination component
// Props:
//	currentPage - the current active page (number)
//	totalPages  - total number of pages available (number)
//	onPageChange - callback fired with the new page number when user navigates

export default function Pagination({ currentPage, totalPages, onPageChange }) {

	// Navigation flags to control button disabled states
	const canGoPrev = currentPage > 1
	const canGoNext = currentPage < totalPages
	const canJumpForward = currentPage + 10 <= totalPages

	// Builds a list of up to 10 page numbers centered around the current page
	function buildPageList() {
		const start = Math.max(1, currentPage - 4)
		const end = Math.min(start + 9, totalPages)
		const pages = []
		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
		return pages
	}

	function handlePrev() { onPageChange(currentPage - 1) }
	function handleNext() { onPageChange(currentPage + 1) }
	// Jumps forward 10 pages at a time
	function handleJumpForward() { onPageChange(currentPage + 10) }

	return (
		<div className="pagination">
			<button onClick={handlePrev} disabled={!canGoPrev}>
				Previous
			</button>

			{buildPageList().map(page => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					disabled={page === currentPage}
				>
					{page}
				</button>
			))}

			{/* Jump forward 10 pages, hidden when near the end */}
			<button
				onClick={handleJumpForward}
				disabled={!canJumpForward}
			>
				...
			</button>

			<button onClick={handleNext} disabled={!canGoNext}>
				Next
			</button>
		</div>
	)
}
