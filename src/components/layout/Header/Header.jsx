import Search from '@/components/ui/Search/Search'

export default function Header({ onSearch }) {
	return (
		<header>
			<span>Logo</span>
			<div className='hero'>
				<h1>Discover Movies</h1>
				<Search onSearch={onSearch} />
			</div>
		</header>
	)
}