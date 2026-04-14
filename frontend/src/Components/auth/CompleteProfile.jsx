import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../layout/NavBar'
import Footer from '../layout/Footer'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import './Auth.css'

function CompleteProfile() {
	const navigate = useNavigate()
	const location = useLocation()
	const { updateProfile } = useAuth()
	const { t } = useTranslation()
	const signupEmail = location.state?.email || ''
	const [formData, setFormData] = useState({
		email: signupEmail,
		username: '',
		fullName: '',
		location: '',
		cropType: '',
		phone: '',
	})
	const [feedback, setFeedback] = useState({ type: '', text: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const result = await updateProfile(formData)

		if (!result.ok) {
			setFeedback({ type: 'error', text: result.message })
			return
		}

		navigate('/login', {
			replace: true,
			state: { message: result.message },
		})
	}

	return (
		<div className="auth-page">
			<NavBar />
			<main className="auth-main">
				<section className="auth-card" aria-labelledby="complete-profile-title">
						<h2 id="complete-profile-title">{t('auth.completeProfile.title')}</h2>
						<p className="auth-subtitle">{t('auth.completeProfile.subtitle')}</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="email">
							{t('auth.completeProfile.email')}
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="username">
							{t('auth.completeProfile.username')}
							<input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required />
						</label>

						<label htmlFor="fullName">
							{t('auth.completeProfile.fullName')}
							<input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required />
						</label>

						<label htmlFor="location">
							{t('auth.completeProfile.location')}
							<input id="location" name="location" type="text" value={formData.location} onChange={handleChange} required />
						</label>

						<label htmlFor="cropType">
							{t('auth.completeProfile.cropType')}
							<input id="cropType" name="cropType" type="text" value={formData.cropType} onChange={handleChange} required />
						</label>

						<label htmlFor="phone">
							{t('auth.completeProfile.phone')}
							<input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">{t('auth.completeProfile.submit')}</button>
					</form>

					<p className="auth-switch-text">
						{t('auth.completeProfile.back')} <Link to="/login">{t('auth.completeProfile.loginLink')}</Link>
					</p>
				</section>
			</main>

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

export default CompleteProfile
