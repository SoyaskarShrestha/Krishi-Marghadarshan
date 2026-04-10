import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { apiRequest } from '../lib/api'
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

const fallbackSavedArticles = [
	{ title: 'Modern Irrigation Techniq...', image: savedArticleImage1 },
	{ title: 'Seasonal Pest Control Gui...', image: savedArticleImage2 },
]

const savedArticleImages = [savedArticleImage1, savedArticleImage2]

function buildEditForm(user) {
	return {
		username: user?.name || '',
		fullName: user?.profile?.fullName || '',
		location: user?.profile?.location || '',
		cropType: user?.profile?.cropType || '',
		phone: user?.profile?.phone || '',
	}
}

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
	const navigate = useNavigate()
	const { currentUser, logout, updateProfile } = useAuth()
	const { isNepali, setLanguage } = useLanguage()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [editError, setEditError] = useState('')
	const [saveSuccessMessage, setSaveSuccessMessage] = useState('')
	const [editForm, setEditForm] = useState(() => buildEditForm(currentUser))
	const [savedArticles, setSavedArticles] = useState(fallbackSavedArticles)

	const displayName = currentUser?.name || 'Farmer User'
	const displayFullName = currentUser?.profile?.fullName || displayName
	const displayPhone = currentUser?.profile?.phone || '+977 9841234567'
	const displayLocation = currentUser?.profile?.location || 'Chitwan, Nepal'
	const displayCropType = currentUser?.profile?.cropType || 'Rice & Mustard'

	useEffect(() => {
		if (!saveSuccessMessage) {
			return undefined
		}

		const timer = window.setTimeout(() => {
			setSaveSuccessMessage('')
		}, 2500)

		return () => window.clearTimeout(timer)
	}, [saveSuccessMessage])

	useEffect(() => {
		let ignore = false

		async function loadSavedArticles() {
			try {
				const payload = await apiRequest('/articles/')
				if (!Array.isArray(payload) || ignore || payload.length === 0) {
					return
				}

				setSavedArticles(
					payload.slice(0, 2).map((article, index) => ({
						title: article.title,
						image: savedArticleImages[index % savedArticleImages.length],
					}))
				)
			} catch {
				// Keep fallback list if API is unavailable.
			}
		}

		loadSavedArticles()

		return () => {
			ignore = true
		}
	}, [])

	const handleEditInputChange = (event) => {
		const { name, value } = event.target
		setEditForm((previous) => ({ ...previous, [name]: value }))
	}

	const handleEditSave = async (event) => {
		event.preventDefault()
		const result = await updateProfile({
			email: currentUser?.email || '',
			username: editForm.username,
			fullName: editForm.fullName,
			location: editForm.location,
			cropType: editForm.cropType,
			phone: editForm.phone,
		})

		if (!result.ok) {
			setEditError(result.message)
			return
		}

		setEditError('')
		setSaveSuccessMessage('Profile details updated successfully.')
		setIsEditModalOpen(false)
	}

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	const handleOpenEditModal = () => {
		setEditError('')
		setEditForm(buildEditForm(currentUser))
		setIsEditModalOpen(true)
	}

	return (
		<div className="member-page">
			<NavBar showSettings />

			<main className="member-shell member-main">
				{saveSuccessMessage ? <div className="member-save-success">{saveSuccessMessage}</div> : null}

				<section className="member-profile-card">
					<div className="member-avatar-wrap">
						<div className="member-avatar-circle">
							<img src={userProfileImage} alt="Rajesh Hamal" />
						</div>
						<button
							type="button"
							className="member-avatar-edit"
							aria-label="Edit profile"
							onClick={handleOpenEditModal}
						>
							<img src={editIcon} alt="" aria-hidden="true" className="member-icon-svg" />
						</button>
					</div>

					<div className="member-profile-copy">
						<span className="member-badge">PREMIUM MEMBER</span>
						<h2>{displayName}</h2>
						<p className="member-real-name">{displayFullName}</p>
						<div className="member-phone-row"><span className="member-inline-icon"><PhoneIcon /></span><span>{displayPhone}</span></div>
						<div className="member-tags">
							<div className="member-tag"><span className="member-inline-icon"><PinIcon /></span><span>{displayLocation}</span></div>
							<div className="member-tag"><span className="member-inline-icon"><CropIcon /></span><span>{displayCropType}</span></div>
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
						<button
							type="button"
							className={`member-language-toggle english ${!isNepali ? 'active' : 'inactive'}`}
							onClick={() => setLanguage('en')}
						>
							<span>English</span>
							{!isNepali ? (
								<span className="member-language-check"><img src={checkIcon} alt="" aria-hidden="true" className="member-icon-svg" /></span>
							) : null}
						</button>
						<button
							type="button"
							className={`member-language-toggle nepali ${isNepali ? 'active' : 'inactive'}`}
							onClick={() => setLanguage('ne')}
						>
							<span>नेपाली (Nepali)</span>
							{isNepali ? (
								<span className="member-language-check"><img src={checkIcon} alt="" aria-hidden="true" className="member-icon-svg" /></span>
							) : null}
						</button>
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
					<button type="button" className="member-logout-button" onClick={handleLogout}>
						<span className="member-logout-icon"><LogoutIcon /></span>
						<span>Logout from Account</span>
					</button>
					<p>Krishi Margadarshan App Version 2.4.0 (Stable)</p>
				</section>
			</main>

			{isEditModalOpen ? (
				<div className="member-edit-overlay" role="dialog" aria-modal="true" aria-labelledby="member-edit-title">
					<form className="member-edit-card" onSubmit={handleEditSave}>
						<h3 id="member-edit-title">Edit Profile Details</h3>
						{editError ? <p className="member-edit-error">{editError}</p> : null}

						<label htmlFor="edit-username">
							Username
							<input id="edit-username" name="username" type="text" value={editForm.username} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-fullName">
							Real Name
							<input id="edit-fullName" name="fullName" type="text" value={editForm.fullName} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-location">
							Location
							<input id="edit-location" name="location" type="text" value={editForm.location} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-cropType">
							Agriculture / Crops
							<input id="edit-cropType" name="cropType" type="text" value={editForm.cropType} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-phone">
							Phone Number
							<input id="edit-phone" name="phone" type="tel" value={editForm.phone} onChange={handleEditInputChange} required />
						</label>

						<div className="member-edit-actions">
							<button type="button" className="member-edit-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
							<button type="submit" className="member-edit-save">Save Changes</button>
						</div>
					</form>
				</div>
			) : null}

			<Footer
				footerClassName="member-footer"
				innerClassName="member-shell member-footer-inner"
				linksClassName="member-footer-links"
				brand="Krishi Margadarshan"
				copy="© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP"
				brandClassName="member-footer-brand"
				copyClassName="member-footer-copy"
				links={[
					{ to: '/advisory', label: 'Support Centers' },
					{ to: '/articles', label: 'FAQ' },
					{ to: '/advisory', label: 'Privacy' },
					{ to: '/advisory', label: 'Contact' },
				]}
			/>
		</div>
	)
}

export default UserProfile




