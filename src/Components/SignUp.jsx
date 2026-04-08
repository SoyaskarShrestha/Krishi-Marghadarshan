import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function SignUp() {
	const navigate = useNavigate()
	const { signUp, signUpWithProvider } = useAuth()
	const [formData, setFormData] = useState({ name: '', email: '', password: '' })
	const [feedback, setFeedback] = useState({ type: '', text: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const result = signUp(formData)

		if (!result.ok) {
			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })
		setTimeout(() => navigate('/complete-profile', { state: { email: result.email } }), 700)
	}

	const handleOAuthSignup = (provider) => {
		const result = signUpWithProvider({ provider })
		if (!result.ok) {
			setFeedback({ type: 'error', text: result.message })
			return
		}

		setFeedback({ type: 'success', text: result.message })
		setTimeout(() => navigate('/complete-profile', { state: { email: result.email } }), 700)
	}

	return (
		<div className="auth-page">
			<NavBar />
			<main className="auth-main">
				<section className="auth-card" aria-labelledby="signup-title">
					<h2 id="signup-title">Create Your Account</h2>
					<p className="auth-subtitle">Sign up first, then login to access your profile page.</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="name">
							Full Name
							<input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
						</label>

						<label htmlFor="email">
							Email
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="password">
							Password
							<input id="password" name="password" type="password" minLength={6} value={formData.password} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">Sign Up</button>
					</form>

					<div className="auth-divider">or continue with OAuth</div>

					<div className="auth-oauth-grid">
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthSignup('Google')}>
							Sign up with Google
						</button>
						<button type="button" className="auth-button oauth" onClick={() => handleOAuthSignup('GitHub')}>
							Sign up with GitHub
						</button>
					</div>

					<p className="auth-switch-text">
						Already signed up? <Link to="/login">Login here</Link>
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

export default SignUp
