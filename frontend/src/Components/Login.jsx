import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loginWithProvider } = useAuth()
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
					<h2 id="login-title">Login to Continue</h2>
					<p className="auth-subtitle">You must login after signing up to access the profile page.</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="email">
							Email
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="password">
							Password
							<input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">Login</button>
					</form>

					<div className="auth-divider">or continue with OAuth</div>

					<div className="auth-oauth-grid">
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthLogin('Google')}>
							Login with Google
						</button>
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthLogin('GitHub')}>
							Login with GitHub
						</button>
					</div>

					<p className="auth-switch-text">
						Don&apos;t have an account? <Link to="/signup">Sign up first</Link>
					</p>
				</section>
			</main>

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

export default Login
