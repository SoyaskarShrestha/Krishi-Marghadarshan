import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import './Auth.css'

function SignUp() {
	const navigate = useNavigate()
	const { signUp, signUpWithProvider } = useAuth()
	const { t } = useTranslation()
	const [formData, setFormData] = useState({ name: '', email: '', password: '' })
	const [feedback, setFeedback] = useState({ type: '', text: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const result = await signUp(formData)

		if (!result.ok) {
			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })
		setTimeout(() => navigate('/complete-profile', { state: { email: result.email } }), 700)
	}

	const handleOAuthSignup = async (provider) => {
		const result = await signUpWithProvider({ provider })
		if (!result.ok) {
			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })

		if (result.profileIncomplete) {
			setTimeout(() => navigate('/complete-profile', { state: { email: result.email } }), 700)
			return
		}

		setTimeout(() => navigate('/login', { state: { message: t('auth.signup.accountReady') } }), 700)
	}

	return (
		<div className="auth-page">
			<NavBar />
			<main className="auth-main">
				<section className="auth-card" aria-labelledby="signup-title">
						<h2 id="signup-title">{t('auth.signup.title')}</h2>
						<p className="auth-subtitle">{t('auth.signup.subtitle')}</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="name">
							{t('auth.signup.name')}
							<input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
						</label>

						<label htmlFor="email">
							{t('auth.signup.email')}
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="password">
							{t('auth.signup.password')}
							<input id="password" name="password" type="password" minLength={6} value={formData.password} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">{t('auth.signup.submit')}</button>
					</form>

					<div className="auth-divider">{t('auth.signup.oauthDivider')}</div>

					<div className="auth-oauth-grid">
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthSignup('Google')}>
							{t('auth.signup.google')}
						</button>
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthSignup('GitHub')}>
							{t('auth.signup.github')}
						</button>
					</div>

					<p className="auth-switch-text">
						{t('auth.signup.already')} <Link to="/login">{t('auth.signup.loginLink')}</Link>
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

export default SignUp
