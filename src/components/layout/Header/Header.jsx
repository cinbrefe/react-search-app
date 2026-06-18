import Search from '@/components/ui/Search/Search'
import logo from '@/assets/tmdb-logo.svg'
import '@/components/layout/Header/Header.scss'

export default function Header({ onSearch }) {
	return (
		<header className='site-header'>
			<div className='container site-header__container'>
				<img src={logo} alt='TMDB Logo' className='site-header__logo' />
				<div className='site-header__content'>
					<h1>Discover Movies</h1>
					<Search onSearch={onSearch} />
				</div>
			</div>
		</header>
	)
}