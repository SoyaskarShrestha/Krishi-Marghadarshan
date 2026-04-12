import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import './Auth.css'

function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loginWithProvider } = useAuth()
	const { t } = useTranslation()
	const [formData, setFormData] = useState({ email: '', password: '' })
	const initialMessage = location.state?.message || ''
	const [feedback, setFeedback] = useState({ type: initialMessage ? 'success' : '', text: initialMessage })

	const targetPath = useMemo(() => location.state?.from || '/user-profile', [location.state])

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const result = await login(formData)

		if (!result.ok) {
			if (result.profileIncomplete) {
				navigate('/complete-profile', {
					replace: true,
					state: { email: result.email },
				})
				return
			}

			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })
		navigate(targetPath, { replace: true })
	}

	const handleOAuthLogin = async (provider) => {
		const result = await loginWithProvider({ provider })
		if (!result.ok) {
			if (result.profileIncomplete) {
				navigate('/complete-profile', {
					replace: true,
					state: { email: result.email },
				})
				return
			}

			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })
		navigate(targetPath, { replace: true })
	}

	return (
		<div className="auth-page">
			<NavBar />
			<main className="auth-main">
				<section className="auth-card" aria-labelledby="login-title">
					<h2 id="login-title">{t('auth.login.title')}</h2>
					<p className="auth-subtitle">{t('auth.login.subtitle')}</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="email">
							{t('auth.login.email')}
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="password">
							{t('auth.login.password')}
							<input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">{t('auth.login.submit')}</button>
					</form>

					<div className="auth-divider">{t('auth.login.oauthDivider')}</div>

					<div className="auth-oauth-grid">
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthLogin('Google')}>
							{t('auth.login.google')}
						</button>
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthLogin('GitHub')}>
							{t('auth.login.github')}
						</button>
					</div>

					<p className="auth-switch-text">
						{t('auth.login.noAccount')} <Link to="/signup">{t('auth.login.signUpLink')}</Link>
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

export default Login
