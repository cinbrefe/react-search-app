import '@/components/layout/Footer/Footer.scss'

export default function Footer() {
	return (
		<footer className='site-footer'>
			<div className='container'>
				{/* Attribution required by the TMDB API terms of use */}
				<p className='site-footer__text'>
					This product uses the <a className='site-footer__link' href='https://www.themoviedb.org/'>TMDB</a> API but is not endorsed or certified by TMDB.
				</p>
			</div>
		</footer>
	)
}
