import { NavLink } from 'react-router-dom'
import bagIcon from '../assets/navbar/bag.svg'
import languageIcon from '../assets/navbar/language.svg'
import profileSimpleIcon from '../assets/navbar/profile-simple.svg'
import searchIcon from '../assets/navbar/search.svg'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'

import './NavBar.css'

function NavBar({
	showSearch = false,
	searchPlaceholder = '',
	showLanguage = true,
	showCart = false,
	cartCount = 0,
}) {
	const { isNepali, toggleLanguage } = useLanguage()
	const { t } = useTranslation()
	const resolvedSearchPlaceholder = searchPlaceholder || t('navbar.searchPlaceholder')

	const labels = {
		brand: t('navbar.brand'),
		home: t('navbar.navigation.home'),
		weather: t('navbar.navigation.weather'),
		articles: t('navbar.navigation.articles'),
		shop: t('navbar.navigation.shop'),
		advisory: t('navbar.navigation.advisory'),
		language: isNepali ? t('navbar.language.en') : t('navbar.language.ne'),
		profile: t('navbar.navigation.profile'),
	}

	return (
		<header className="navbar">
			<div className="navbar-shell">
				<div className="navbar-brand-group">
					<NavLink to="/" end className="navbar-brand-link">
						<h1 className="navbar-brand">{labels.brand}</h1>
					</NavLink>
					{showSearch ? (
						<div className="navbar-search" role="search" aria-label={t('navbar.searchAria')}>
							<span className="navbar-search-icon">
								<img src={searchIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							</span>
							<span>{resolvedSearchPlaceholder}</span>
						</div>
					) : null}
				</div>

				<nav className="navbar-nav" aria-label="Main navigation">
					<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>{labels.home}</NavLink>
					<NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>{labels.weather}</NavLink>
					<NavLink to="/articles" className={({ isActive }) => (isActive ? 'active' : '')}>{labels.articles}</NavLink>
					<NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>{labels.shop}</NavLink>
					<NavLink to="/advisory" className={({ isActive }) => (isActive ? 'active' : '')}>{labels.advisory}</NavLink>
				</nav>

				<div className="navbar-actions">
					{showLanguage ? (
						<button type="button" className="navbar-language" onClick={toggleLanguage}>
							<span className="navbar-inline-icon">
								<img src={languageIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							</span>
							<span>{labels.language}</span>
						</button>
					) : null}
					{showCart ? (
						<NavLink to="/cart" className="navbar-bag" aria-label="Cart">
							<img src={bagIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							<span className="navbar-bag-count">{cartCount}</span>
						</NavLink>
					) : null}
				
					<NavLink to="/user-profile" className="navbar-profile-link" aria-label="Profile">
						<span className="navbar-inline-icon navbar-profile-icon" aria-hidden="true">
							<img src={profileSimpleIcon} alt="" className="navbar-icon-image" />
						</span>
						<span>{labels.profile}</span>
					</NavLink>
				</div>
			</div>
		</header>
	)
}

export default NavBar


