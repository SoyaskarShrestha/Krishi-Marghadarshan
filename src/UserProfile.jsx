import { NavLink } from 'react-router-dom'
import './UserProfile.css'
import productImage1 from './assets/homepage/product-1.jpg'
import productImage2 from './assets/homepage/product-2.jpg'

const savedArticles = [
	{ title: 'Modern Irrigation Techniq...', image: productImage1 },
	{ title: 'Seasonal Pest Control Gui...', image: productImage2 },
]

function LanguageIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M4 5h8M8 5c0 5-2 8-5 10M6 9c1.2 2.1 3 4 5 5M14 5l6 14M16 14h6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function GearIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="m12 3 1.3 1.1 1.7-.2.8 1.6 1.6.8-.2 1.7L21 9.3l-1.1 1.3.2 1.7-1.6.8-.8 1.6-1.7-.2L12 21l-1.3-1.1-1.7.2-.8-1.6-1.6-.8.2-1.7L3 14.7l1.1-1.3-.2-1.7 1.6-.8.8-1.6 1.7.2L12 3Zm0 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function PhoneIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M7 5h3l1.2 3.2-1.7 1.7a14 14 0 0 0 4.5 4.5l1.7-1.7L19 14v3c0 .6-.4 1-1 1A14 14 0 0 1 6 6c0-.6.4-1 1-1Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function PinIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M12 21s5-4.8 5-10a5 5 0 1 0-10 0c0 5.2 5 10 5 10Zm0-8.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function CropIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M6 17c4.5 0 8-3.5 8-8 0-1.5-.4-2.9-1.1-4-4.8 0-8.9 4.1-8.9 8.9 0 1.1.2 2.1.6 3.1Zm8-6h6M17 8l3 3-3 3"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function BagIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M7 9V7a5 5 0 0 1 10 0v2M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function BookmarkIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M7 5h10v14l-5-3-5 3V5Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ArrowRightIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M5 12h14M13 6l6 6-6 6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.9"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function LogoutIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="member-icon-svg">
			<path
				d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4M13 16l4-4-4-4M17 12H9"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function UserProfile() {
	return (
		<div className="member-page">
			<header className="member-header">
				<div className="member-shell member-header-inner">
					<h1 className="member-brand">Krishi Margadarshan</h1>

					<nav className="member-nav" aria-label="Main navigation">
						<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
						<NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>Weather</NavLink>
						<NavLink to="/articles" className={({ isActive }) => (isActive ? 'active' : '')}>Articles</NavLink>
						<NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>Shop</NavLink>
						<NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
					</nav>

					<div className="member-header-actions">
						<div className="member-language"><span className="member-inline-icon"><LanguageIcon /></span><span>Language</span></div>
						<button type="button" className="member-settings-button" aria-label="Settings"><GearIcon /></button>
					</div>
				</div>
			</header>

			<main className="member-shell member-main">
				<section className="member-profile-card">
					<div className="member-avatar-wrap">
						<div className="member-avatar-circle">
							<div className="member-avatar-outline" />
							<span>WPUSFE</span>
						</div>
						<button type="button" className="member-avatar-edit">✎</button>
					</div>

					<div className="member-profile-copy">
						<span className="member-badge">PREMIUM MEMBER</span>
						<h2>Rajesh Hamal</h2>
						<div className="member-phone-row"><span className="member-inline-icon"><PhoneIcon /></span><span>+977 9841234567</span></div>
						<div className="member-tags">
							<div className="member-tag"><span className="member-inline-icon"><PinIcon /></span><span>Chitwan, Nepal</span></div>
							<div className="member-tag"><span className="member-inline-icon"><CropIcon /></span><span>Rice &amp; Mustard</span></div>
						</div>
					</div>
				</section>

				<section className="member-dashboard-top">
					<article className="member-card member-history-card">
						<div className="member-card-icon green"><BagIcon /></div>
						<div className="member-history-copy">
							<h3>Order History</h3>
							<p>मेरो अर्डर - Track your fertilizer and seed purchases</p>
							<a href="/cart">
								<span>View 12 Recent Orders</span>
								<span className="member-history-arrow"><ArrowRightIcon /></span>
							</a>
						</div>
						<div className="member-history-ghost"><BagIcon /></div>
					</article>

					<article className="member-card member-language-card">
						<div className="member-card-icon white"><LanguageIcon /></div>
						<h3>Language Settings</h3>
						<div className="member-language-toggle english">English</div>
						<div className="member-language-toggle nepali">नेपाली (Nepali)</div>
					</article>
				</section>

				<section className="member-dashboard-bottom">
					<article className="member-card member-saved-card">
						<div className="member-card-top">
							<div className="member-card-icon dark"><BookmarkIcon /></div>
							<strong>08</strong>
						</div>
						<h3>Saved Articles</h3>
						<p>बचा राखिएका लेखहरू</p>
						<div className="member-saved-list">
							{savedArticles.map((article) => (
								<div className="member-saved-item" key={article.title}>
									<img src={article.image} alt={article.title} />
									<span>{article.title}</span>
								</div>
							))}
						</div>
					</article>

					<article className="member-card member-plain-card">
						<small>Weather Alert Location</small>
						<h3>Chitwan Valley</h3>
					</article>

					<article className="member-card member-plain-card">
						<small>Consultations</small>
						<h3>4 Available</h3>
					</article>
				</section>

				<section className="member-logout-section">
					<button type="button" className="member-logout-button">
						<span className="member-logout-icon"><LogoutIcon /></span>
						<span>Logout from Account</span>
					</button>
					<p>Krishi Margadarshan App Version 2.4.0 (Stable)</p>
				</section>
			</main>

			<footer className="member-footer">
				<div className="member-shell member-footer-inner">
					<div className="member-footer-brand">Krishi Margadarshan</div>
					<div className="member-footer-links">
						<a href="/">Support Centers</a>
						<a href="/">FAQ</a>
						<a href="/">Privacy</a>
						<a href="/">Contact</a>
					</div>
					<div className="member-footer-copy">© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</div>
				</div>
			</footer>
		</div>
	)
}

export default UserProfile
