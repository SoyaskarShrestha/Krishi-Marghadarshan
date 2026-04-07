import { Link } from 'react-router-dom'
import './UserProfile.css'
import NavBar from './NavBar'
import userProfileImage from '../assets/user-profile/user-profile.jpg'
import savedArticleImage1 from '../assets/user-profile/saved-article-1.jpg'
import savedArticleImage2 from '../assets/user-profile/saved-article-2.jpg'
import editIcon from '../assets/user-profile/icon-edit.svg'
import phoneIcon from '../assets/user-profile/icon-phone.svg'
import pinIcon from '../assets/user-profile/icon-pin.svg'
import cropIcon from '../assets/user-profile/icon-crop.svg'
import languageIcon from '../assets/user-profile/icon-language.svg'
import checkIcon from '../assets/user-profile/icon-check.svg'
import bookmarkIcon from '../assets/user-profile/icon-bookmark.svg'
import bagIcon from '../assets/user-profile/icon-bag.svg'
import arrowRightIcon from '../assets/user-profile/icon-arrow-right.svg'
import bagGhostIcon from '../assets/user-profile/icon-bag-ghost.svg'
import logoutIcon from '../assets/user-profile/icon-logout.svg'

const savedArticles = [
	{ title: 'Modern Irrigation Techniq...', image: savedArticleImage1 },
	{ title: 'Seasonal Pest Control Gui...', image: savedArticleImage2 },
]

function PhoneIcon() {
	return <img src={phoneIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function PinIcon() {
	return <img src={pinIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function CropIcon() {
	return <img src={cropIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function BagIcon() {
	return <img src={bagIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function BookmarkIcon() {
	return <img src={bookmarkIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function ArrowRightIcon() {
	return <img src={arrowRightIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function LogoutIcon() {
	return <img src={logoutIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function LanguageIcon() {
	return <img src={languageIcon} alt="" aria-hidden="true" className="member-icon-svg" />
}

function UserProfile() {
	return (
		<div className="member-page">
			<NavBar showSettings />

			<main className="member-shell member-main">
				<section className="member-profile-card">
					<div className="member-avatar-wrap">
						<div className="member-avatar-circle">
							<img src={userProfileImage} alt="Rajesh Hamal" />
						</div>
						<button type="button" className="member-avatar-edit" aria-label="Edit profile">
							<img src={editIcon} alt="" aria-hidden="true" className="member-icon-svg" />
						</button>
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
							<Link to="/cart">
								<span>View 12 Recent Orders</span>
								<span className="member-history-arrow"><ArrowRightIcon /></span>
							</Link>
						</div>
						<div className="member-history-ghost">
							<img src={bagGhostIcon} alt="" aria-hidden="true" className="member-icon-svg" />
						</div>
					</article>

					<article className="member-card member-language-card">
						<div className="member-card-icon white"><LanguageIcon /></div>
						<h3>Language Settings</h3>
						<div className="member-language-toggle english">
							<span>English</span>
							<span className="member-language-check"><img src={checkIcon} alt="" aria-hidden="true" className="member-icon-svg" /></span>
						</div>
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
						<Link to="/advisory">Support Centers</Link>
						<Link to="/articles">FAQ</Link>
						<Link to="/advisory">Privacy</Link>
						<Link to="/advisory">Contact</Link>
					</div>
					<div className="member-footer-copy">© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</div>
				</div>
			</footer>
		</div>
	)
}

export default UserProfile






