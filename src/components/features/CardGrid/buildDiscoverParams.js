export default function buildDiscoverParams(filters, page) {
	const params = new URLSearchParams({ page, include_adult: false })
	const sortBy = filters?.sortBy || 'popularity.desc'
	params.set('sort_by', sortBy)
	if (sortBy === 'vote_average.desc') params.set('vote_count.gte', 200)
	if (filters?.genres?.length > 0) params.set('with_genres', filters.genres.join(','))
	if (filters?.ratingFilter) {
		params.set('vote_average.gte', filters.ratingFilter)
		if (!params.has('vote_count.gte')) params.set('vote_count.gte', 100)
	}
	if (filters?.yearFrom) params.set('primary_release_date.gte', `${filters.yearFrom}-01-01`)
	if (filters?.yearTo) params.set('primary_release_date.lte', `${filters.yearTo}-12-31`)
	if (sortBy === 'release_date.desc') {
		// Newest first would otherwise start with unreleased films that have no votes yet
		const today = new Date().toISOString().slice(0, 10)
		const releasedBy = params.get('primary_release_date.lte')
		if (!releasedBy || releasedBy > today) params.set('primary_release_date.lte', today)
		if (!params.has('vote_count.gte')) params.set('vote_count.gte', 10)
	}
	return params.toString()
}
