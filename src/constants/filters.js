// Filter constants

export const GENRES = [
	{ id: 28, name: 'Action' },
	{ id: 12, name: 'Adventure' },
	{ id: 16, name: 'Animation' },
	{ id: 35, name: 'Comedy' },
	{ id: 80, name: 'Crime' },
	{ id: 99, name: 'Documentary' },
	{ id: 18, name: 'Drama' },
	{ id: 14, name: 'Fantasy' },
	{ id: 27, name: 'Horror' },
	{ id: 9648, name: 'Mystery' },
	{ id: 10749, name: 'Romance' },
	{ id: 878, name: 'Science Fiction' },
	{ id: 53, name: 'Thriller' },
]

export const SORT_OPTIONS = [
	{ value: 'popularity.desc', label: 'Popularity' },
	{ value: 'release_date.desc', label: 'Release Date' },
	{ value: 'vote_average.desc', label: 'Rating' },
]

export const RATINGS = [5, 6, 7, 8, 9]

export const INITIAL_FILTERS = {
	genres: [],
	ratingFilter: '',
	yearFrom: '',
	yearTo: '',
	sortBy: 'popularity.desc',
}
