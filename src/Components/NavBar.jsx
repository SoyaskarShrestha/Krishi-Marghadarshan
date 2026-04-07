import { NavLink } from 'react-router-dom'
import bagIcon from '../assets/navbar/bag.svg'
import languageIcon from '../assets/navbar/language.svg'
import searchIcon from '../assets/navbar/search.svg'
import settingsIcon from '../assets/navbar/settings.svg'
import './NavBar.css'

function NavBar({
	showSearch = false,
	searchPlaceholder = 'Search...',
	showLanguage = true,
	showCart = false,
	cartCount = 0,
	showSettings = false,
}) {
	return (
		<header className="navbar">
			<div className="navbar-shell">
				<div className="navbar-brand-group">
					<NavLink to="/" end className="navbar-brand-link">
						<h1 className="navbar-brand">Krishi Margadarshan</h1>
					</NavLink>
					{showSearch ? (
						<div className="navbar-search" role="search" aria-label="Search">
							<span className="navbar-search-icon">
								<img src={searchIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							</span>
							<span>{searchPlaceholder}</span>
						</div>
					) : null}
				</div>

				<nav className="navbar-nav" aria-label="Main navigation">
					<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
					<NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>Weather</NavLink>
					<NavLink to="/articles" className={({ isActive }) => (isActive ? 'active' : '')}>Articles</NavLink>
					<NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>Shop</NavLink>
					<NavLink to="/advisory" className={({ isActive }) => (isActive ? 'active' : '')}>Advisory</NavLink>
				</nav>

				<div className="navbar-actions">
					{showLanguage ? (
						<div className="navbar-language">
							<span className="navbar-inline-icon">
								<img src={languageIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							</span>
							<span>Language</span>
						</div>
					) : null}
					{showCart ? (
						<NavLink to="/cart" className="navbar-bag" aria-label="Cart">
							<img src={bagIcon} alt="" aria-hidden="true" className="navbar-icon-image" />
							<span className="navbar-bag-count">{cartCount}</span>
						</NavLink>
					) : null}
				
					<NavLink to="/user-profile" className="navbar-profile-link" aria-label="Profile">
						<span className="navbar-inline-icon navbar-profile-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" className="navbar-icon-svg" focusable="false">
								<path
									d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.2c-4.4 0-8 2.4-8 5.4V21h16v-.9c0-3-3.6-5.4-8-5.4Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.7"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span>Profile</span>
					</NavLink>
				</div>
			</div>
		</header>
	)
}

export default NavBar


