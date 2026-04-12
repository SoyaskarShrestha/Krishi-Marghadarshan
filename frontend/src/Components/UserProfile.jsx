import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
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
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [editError, setEditError] = useState('')
	const [saveSuccessMessage, setSaveSuccessMessage] = useState('')
	const [editForm, setEditForm] = useState(() => buildEditForm(currentUser))
	const [savedArticles, setSavedArticles] = useState([])

	const displayName = currentUser?.name || t('userProfile.fallbackName')
	const displayFullName = currentUser?.profile?.fullName || displayName
	const displayPhone = currentUser?.profile?.phone || t('userProfile.fallbackPhone')
	const displayLocation = currentUser?.profile?.location || t('userProfile.fallbackLocation')
	const displayCropType = currentUser?.profile?.cropType || t('userProfile.fallbackCropType')

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
				const payload = await apiRequest(API_ENDPOINTS.ARTICLES_SAVED)
				if (!Array.isArray(payload) || ignore || payload.length === 0) {
					if (!ignore) {
						setSavedArticles([])
					}
					return
				}

				setSavedArticles(
					payload.slice(0, 4).map((item, index) => ({
						title: item.article?.title,
						image: savedArticleImages[index % savedArticleImages.length],
					}))
				)
			} catch {
				if (!ignore) {
					setSavedArticles([])
				}
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
		setSaveSuccessMessage(t('userProfile.editSuccess'))
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
							aria-label={t('userProfile.editAria')}
							onClick={handleOpenEditModal}
						>
							<img src={editIcon} alt="" aria-hidden="true" className="member-icon-svg" />
						</button>
					</div>

					<div className="member-profile-copy">
						<span className="member-badge">{t('userProfile.premiumMember')}</span>
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
							<h3>{t('userProfile.orderHistory')}</h3>
							<p>{t('userProfile.orderHistoryDescription')}</p>
							<Link to="/cart">
								<span>{t('userProfile.viewRecentOrders')}</span>
								<span className="member-history-arrow"><ArrowRightIcon /></span>
							</Link>
						</div>
						<div className="member-history-ghost">
							<img src={bagGhostIcon} alt="" aria-hidden="true" className="member-icon-svg" />
						</div>
					</article>

					<article className="member-card member-language-card">
						<div className="member-card-icon white"><LanguageIcon /></div>
						<h3>{t('userProfile.languageSettings')}</h3>
						<button
							type="button"
							className={`member-language-toggle english ${!isNepali ? 'active' : 'inactive'}`}
							onClick={() => setLanguage('en')}
						>
							<span>{t('userProfile.languageEnglish')}</span>
							{!isNepali ? (
								<span className="member-language-check"><img src={checkIcon} alt="" aria-hidden="true" className="member-icon-svg" /></span>
							) : null}
						</button>
						<button
							type="button"
							className={`member-language-toggle nepali ${isNepali ? 'active' : 'inactive'}`}
							onClick={() => setLanguage('ne')}
						>
							<span>{t('userProfile.languageNepali')}</span>
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
							<strong>{String(savedArticles.length).padStart(2, '0')}</strong>
						</div>
						<h3>{t('userProfile.savedArticles')}</h3>
						<p>{t('userProfile.savedArticlesNepali')}</p>
						<div className="member-saved-list">
							{savedArticles.length === 0 ? <span className="member-saved-empty">No saved articles yet.</span> : null}
							{savedArticles.map((article) => (
								<div className="member-saved-item" key={article.title}>
									<img src={article.image} alt={article.title} />
									<span>{article.title}</span>
								</div>
							))}
						</div>
					</article>

					<article className="member-card member-plain-card">
						<small>{t('userProfile.weatherAlertLocation')}</small>
						<h3>{displayLocation}</h3>
					</article>

					<article className="member-card member-plain-card">
						<small>{t('userProfile.consultations')}</small>
						<h3>{t('userProfile.consultationsValue')}</h3>
					</article>
				</section>

				<section className="member-logout-section">
					<button type="button" className="member-logout-button" onClick={handleLogout}>
						<span className="member-logout-icon"><LogoutIcon /></span>
						<span>{t('userProfile.logout')}</span>
					</button>
					<p>{t('userProfile.version')}</p>
				</section>
			</main>

			{isEditModalOpen ? (
				<div className="member-edit-overlay" role="dialog" aria-modal="true" aria-labelledby="member-edit-title">
					<form className="member-edit-card" onSubmit={handleEditSave}>
						<h3 id="member-edit-title">{t('userProfile.editProfile')}</h3>
						{editError ? <p className="member-edit-error">{editError}</p> : null}

						<label htmlFor="edit-username">
							{t('userProfile.username')}
							<input id="edit-username" name="username" type="text" value={editForm.username} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-fullName">
							{t('userProfile.fullName')}
							<input id="edit-fullName" name="fullName" type="text" value={editForm.fullName} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-location">
							{t('userProfile.location')}
							<input id="edit-location" name="location" type="text" value={editForm.location} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-cropType">
							{t('userProfile.cropType')}
							<input id="edit-cropType" name="cropType" type="text" value={editForm.cropType} onChange={handleEditInputChange} required />
						</label>

						<label htmlFor="edit-phone">
							{t('userProfile.phone')}
							<input id="edit-phone" name="phone" type="tel" value={editForm.phone} onChange={handleEditInputChange} required />
						</label>

						<div className="member-edit-actions">
							<button type="button" className="member-edit-cancel" onClick={() => setIsEditModalOpen(false)}>{t('userProfile.cancel')}</button>
							<button type="submit" className="member-edit-save">{t('userProfile.saveChanges')}</button>
						</div>
					</form>
				</div>
			) : null}

			<Footer
				footerClassName="member-footer"
				innerClassName="member-shell member-footer-inner"
				linksClassName="member-footer-links"
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
				brandClassName="member-footer-brand"
				copyClassName="member-footer-copy"
				links={[
					{ to: '/advisory', label: t('common.supportCenters') },
					{ to: '/articles', label: t('common.faq') },
					{ to: '/advisory', label: t('common.privacy') },
					{ to: '/advisory', label: t('common.contact') },
				]}
			/>
		</div>
	)
}

export default UserProfile




