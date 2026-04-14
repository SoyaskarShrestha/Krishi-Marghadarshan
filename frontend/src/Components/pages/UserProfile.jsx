import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import NavBar from '../layout/NavBar'
import Footer from '../layout/Footer'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'
import userProfileImage from '../../assets/user-profile/user-profile.jpg'
import savedArticleImage1 from '../../assets/user-profile/saved-article-1.jpg'
import savedArticleImage2 from '../../assets/user-profile/saved-article-2.jpg'
import editIcon from '../../assets/user-profile/icon-edit.svg'
import phoneIcon from '../../assets/user-profile/icon-phone.svg'
import pinIcon from '../../assets/user-profile/icon-pin.svg'
import cropIcon from '../../assets/user-profile/icon-crop.svg'
import languageIcon from '../../assets/user-profile/icon-language.svg'
import checkIcon from '../../assets/user-profile/icon-check.svg'
import bookmarkIcon from '../../assets/user-profile/icon-bookmark.svg'
import bagIcon from '../../assets/user-profile/icon-bag.svg'
import arrowRightIcon from '../../assets/user-profile/icon-arrow-right.svg'
import bagGhostIcon from '../../assets/user-profile/icon-bag-ghost.svg'
import logoutIcon from '../../assets/user-profile/icon-logout.svg'
import { useTranslation } from 'react-i18next'

const savedArticleImages = [savedArticleImage1, savedArticleImage2]
const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024

function resolveProfilePhotoUrl(photoPath) {
	if (!photoPath) {
		return userProfileImage
	}

	if (/^https?:\/\//i.test(photoPath)) {
		return photoPath
	}

	const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
	const origin = apiBase.replace(/\/api\/?$/, '')
	const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`
	return `${origin}${normalizedPath}`
}

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
	const { currentUser, logout, updateProfile, uploadProfilePhoto } = useAuth()
	const { isNepali, setLanguage } = useLanguage()
	const { t } = useTranslation()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [editError, setEditError] = useState('')
	const [saveSuccessMessage, setSaveSuccessMessage] = useState('')
	const [photoMessage, setPhotoMessage] = useState('')
	const [photoError, setPhotoError] = useState('')
	const [editForm, setEditForm] = useState(() => buildEditForm(currentUser))
	const [savedArticles, setSavedArticles] = useState([])
	const [orderSummary, setOrderSummary] = useState({
		itemCount: 0,
		totalQuantity: 0,
		lastUpdated: '',
		isLoading: true,
		hasError: false,
	})
	const [consultationSummary, setConsultationSummary] = useState({
		availableAdvisors: null,
		avgResponseMinutes: null,
		myPendingQuestions: 0,
		myAnsweredThisWeek: 0,
		isLoading: true,
		hasError: false,
	})
	const [weatherCard, setWeatherCard] = useState({
		location: '',
		alertLevel: 'low',
		rainfall: '--',
		tempMin: '--',
		tempMax: '--',
		advisoryNote: '',
		updatedAt: '',
		isLoading: true,
		hasError: false,
	})

	const displayName = currentUser?.name || t('userProfile.fallbackName')
	const displayFullName = currentUser?.profile?.fullName || displayName
	const displayPhone = currentUser?.profile?.phone || t('userProfile.fallbackPhone')
	const displayLocation = currentUser?.profile?.location || t('userProfile.fallbackLocation')
	const displayCropType = currentUser?.profile?.cropType || t('userProfile.fallbackCropType')
	const profilePhotoUrl = resolveProfilePhotoUrl(currentUser?.profile?.profilePhoto)
	const fileInputRef = useRef(null)

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

		async function loadOrderSummary() {
			setOrderSummary((previous) => ({ ...previous, isLoading: true, hasError: false }))

			try {
				const payload = await apiRequest(API_ENDPOINTS.SHOP_CART)
				const items = Array.isArray(payload) ? payload : []
				const totalQuantity = items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
				const latestUpdated = items
					.map((item) => item?.updated_at)
					.filter(Boolean)
					.sort()
					.pop()

				if (!ignore) {
					setOrderSummary({
						itemCount: items.length,
						totalQuantity,
						lastUpdated: latestUpdated ? new Date(latestUpdated).toLocaleString() : '',
						isLoading: false,
						hasError: false,
					})
				}
			} catch {
				if (!ignore) {
					setOrderSummary((previous) => ({
						...previous,
						isLoading: false,
						hasError: true,
					}))
				}
			}
		}

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
		loadOrderSummary()
		const ordersIntervalId = window.setInterval(loadOrderSummary, 5 * 60 * 1000)

		return () => {
			ignore = true
			window.clearInterval(ordersIntervalId)
		}
	}, [])

	useEffect(() => {
		let ignore = false

		async function loadWeatherCard() {
			setWeatherCard((previous) => ({
				...previous,
				isLoading: true,
				hasError: false,
			}))

			try {
				const payload = await apiRequest(`${API_ENDPOINTS.WEATHER_FORECAST}?location=${encodeURIComponent(displayLocation)}`)

				const rainfallRaw = payload?.stats?.find((item) => item.kind === 'rainfall')?.value || '--'
				const rainfallNumber = Number.parseInt(String(rainfallRaw).replace(/[^0-9]/g, ''), 10)
				let alertLevel = 'low'
				if (Number.isFinite(rainfallNumber) && rainfallNumber >= 20) {
					alertLevel = 'high'
				} else if (Number.isFinite(rainfallNumber) && rainfallNumber >= 5) {
					alertLevel = 'moderate'
				}

				const today = payload?.weekly?.[0]
				const note = (payload?.guide?.body || '').split('. ')[0]

				if (!ignore) {
					setWeatherCard({
						location: payload?.location || displayLocation,
						alertLevel,
						rainfall: rainfallRaw,
						tempMin: today?.low || '--',
						tempMax: today?.high || '--',
						advisoryNote: note,
						updatedAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
						isLoading: false,
						hasError: false,
					})
				}
			} catch {
				if (!ignore) {
					setWeatherCard({
						location: displayLocation,
						alertLevel: 'low',
						rainfall: '--',
						tempMin: '--',
						tempMax: '--',
						advisoryNote: '',
						updatedAt: '',
						isLoading: false,
						hasError: true,
					})
				}
			}
		}

		loadWeatherCard()
		const weatherIntervalId = window.setInterval(loadWeatherCard, 5 * 60 * 1000)

		return () => {
			ignore = true
			window.clearInterval(weatherIntervalId)
		}
	}, [displayLocation])

	useEffect(() => {
		let ignore = false

		async function loadConsultationSummary() {
			setConsultationSummary((previous) => ({ ...previous, isLoading: true, hasError: false }))

			try {
				const payload = await apiRequest(API_ENDPOINTS.AUTH_CONSULTATION_SUMMARY)
				if (!ignore) {
					setConsultationSummary({
						availableAdvisors: typeof payload?.available_advisors === 'number' ? payload.available_advisors : null,
						avgResponseMinutes: typeof payload?.avg_response_minutes === 'number' ? payload.avg_response_minutes : null,
						myPendingQuestions: typeof payload?.my_pending_questions === 'number' ? payload.my_pending_questions : 0,
						myAnsweredThisWeek: typeof payload?.my_answered_this_week === 'number' ? payload.my_answered_this_week : 0,
						isLoading: false,
						hasError: false,
					})
				}
			} catch {
				if (!ignore) {
					setConsultationSummary((previous) => ({
						...previous,
						isLoading: false,
						hasError: true,
					}))
				}
			}
		}

		loadConsultationSummary()
		const consultationIntervalId = window.setInterval(loadConsultationSummary, 5 * 60 * 1000)

		return () => {
			ignore = true
			window.clearInterval(consultationIntervalId)
		}
	}, [])

	const formatDuration = (totalMinutes) => {
		if (typeof totalMinutes !== 'number' || totalMinutes < 0) {
			return null
		}

		const hours = Math.floor(totalMinutes / 60)
		const minutes = totalMinutes % 60

		if (hours === 0) {
			return `${minutes}${t('userProfile.minuteShort')}`
		}

		if (minutes === 0) {
			return `${hours}${t('userProfile.hourShort')}`
		}

		return `${hours}${t('userProfile.hourShort')} ${minutes}${t('userProfile.minuteShort')}`
	}

	const availabilityText = consultationSummary.isLoading
		? t('userProfile.consultationsChecking')
		: consultationSummary.hasError || consultationSummary.availableAdvisors === null
			? t('userProfile.consultationsUnavailable')
			: t('userProfile.consultationsAvailableNow', { count: consultationSummary.availableAdvisors })

	const avgReplyText = formatDuration(consultationSummary.avgResponseMinutes)

	const weatherAlertLabelByLevel = {
		low: t('userProfile.weatherAlertRiskLow'),
		moderate: t('userProfile.weatherAlertRiskModerate'),
		high: t('userProfile.weatherAlertRiskHigh'),
	}

	const weatherAlertLabel = weatherAlertLabelByLevel[weatherCard.alertLevel] || weatherAlertLabelByLevel.low
	const weatherDetailsLink = `/weather?location=${encodeURIComponent((weatherCard.location || displayLocation || '').trim())}`

	const orderCardDescription = orderSummary.isLoading
		? t('userProfile.orderHistoryLoading')
		: orderSummary.hasError
			? t('userProfile.orderHistoryUnavailable')
			: orderSummary.itemCount === 0
				? t('userProfile.orderHistoryEmpty')
				: t('userProfile.orderHistoryDescriptionDynamic', {
					count: orderSummary.itemCount,
					quantity: orderSummary.totalQuantity,
				})

	const orderCardCta = t('userProfile.viewRecentOrdersDynamic', { count: orderSummary.itemCount })

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

	const handleAvatarButtonClick = () => {
		fileInputRef.current?.click()
	}

	const handlePhotoFileChange = async (event) => {
		const file = event.target.files?.[0]
		if (!file) {
			return
		}

		setPhotoMessage('')
		setPhotoError('')

		if (!file.type || !file.type.startsWith('image/')) {
			setPhotoError(t('userProfile.profilePhotoInvalidType'))
			event.target.value = ''
			return
		}

		if (file.size > MAX_PROFILE_PHOTO_BYTES) {
			setPhotoError(t('userProfile.profilePhotoTooLarge', { maxMB: 5 }))
			event.target.value = ''
			return
		}

		const result = await uploadProfilePhoto(file)
		if (!result.ok) {
			setPhotoError(result.message || t('userProfile.profilePhotoUploadFailed'))
			event.target.value = ''
			return
		}

		setPhotoMessage(result.message || t('userProfile.profilePhotoUploaded'))
		event.target.value = ''
	}

	return (
		<div className="member-page">
			<NavBar showSettings />

			<main className="member-shell member-main">
				{saveSuccessMessage ? <div className="member-save-success">{saveSuccessMessage}</div> : null}
				{photoMessage ? <div className="member-save-success">{photoMessage}</div> : null}
				{photoError ? <div className="member-edit-error">{photoError}</div> : null}

				<section className="member-profile-card">
					<div className="member-avatar-wrap">
						<div className="member-avatar-circle">
							<img src={profilePhotoUrl} alt={displayName} />
						</div>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={handlePhotoFileChange}
							className="member-avatar-file-input"
						/>
						<button
							type="button"
							className="member-avatar-edit"
							aria-label={t('userProfile.uploadPhotoAria')}
							onClick={handleAvatarButtonClick}
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
						<button type="button" className="member-profile-edit-button" onClick={handleOpenEditModal}>
							{t('userProfile.editDetails')}
						</button>
					</div>
				</section>

				<section className="member-dashboard-top">
					<article className="member-card member-history-card">
						<div className="member-card-icon green"><BagIcon /></div>
						<div className="member-history-copy">
							<h3>{t('userProfile.orderHistory')}</h3>
							<p>{orderCardDescription}</p>
							{orderSummary.lastUpdated ? <small className="member-history-meta">{t('userProfile.orderHistoryUpdated', { time: orderSummary.lastUpdated })}</small> : null}
							<Link to="/cart">
								<span>{orderCardCta}</span>
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

					<Link to={weatherDetailsLink} className="member-card member-plain-card member-link-card">
						<small>{t('userProfile.weatherAlertLocation')}</small>
						<h3>{weatherCard.location || displayLocation}</h3>
						{weatherCard.isLoading ? <p className="member-consultation-meta">{t('userProfile.weatherAlertLoading')}</p> : null}
						{weatherCard.hasError ? <p className="member-consultation-meta">{t('userProfile.weatherAlertUnavailable')}</p> : null}
						{!weatherCard.isLoading && !weatherCard.hasError ? (
							<>
								<span className={`member-weather-risk ${weatherCard.alertLevel}`}>{weatherAlertLabel}</span>
								<p className="member-consultation-meta"><span className="member-meta-icon rain" aria-hidden="true" />{t('userProfile.weatherAlertRainfall', { value: weatherCard.rainfall })}</p>
								<p className="member-consultation-meta"><span className="member-meta-icon temp" aria-hidden="true" />{t('userProfile.weatherAlertTempRange', { min: weatherCard.tempMin, max: weatherCard.tempMax })}</p>
								{weatherCard.advisoryNote ? <p className="member-consultation-meta"><span className="member-meta-icon note" aria-hidden="true" />{t('userProfile.weatherAlertAdvice', { note: weatherCard.advisoryNote })}</p> : null}
								{weatherCard.updatedAt ? <p className="member-consultation-meta">{t('userProfile.weatherAlertUpdated', { time: weatherCard.updatedAt })}</p> : null}
							</>
						) : null}
						<span className="member-link-hint">{t('userProfile.openWeatherDetails')}</span>
					</Link>

					<Link to="/advisory" className="member-card member-plain-card member-link-card">
						<small>{t('userProfile.consultations')}</small>
						<h3>{availabilityText}</h3>
						<p className="member-consultation-meta"><span className="member-meta-icon pending" aria-hidden="true" />{t('userProfile.consultationsPendingQuestions', { count: consultationSummary.myPendingQuestions })}</p>
						<p className="member-consultation-meta"><span className="member-meta-icon answered" aria-hidden="true" />{t('userProfile.consultationsAnsweredThisWeek', { count: consultationSummary.myAnsweredThisWeek })}</p>
						<p className="member-consultation-meta">
							{avgReplyText
								? t('userProfile.consultationsAvgReply', { time: avgReplyText })
								: t('userProfile.consultationsAvgReplyUnavailable')}
						</p>
						<span className="member-link-hint">{t('userProfile.openConsultationDetails')}</span>
					</Link>
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




