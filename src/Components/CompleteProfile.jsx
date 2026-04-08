import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function CompleteProfile() {
	const navigate = useNavigate()
	const location = useLocation()
	const { updateProfile } = useAuth()
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

	const handleSubmit = (event) => {
		event.preventDefault()
		const result = updateProfile(formData)

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
					<h2 id="complete-profile-title">Complete Your Profile</h2>
					<p className="auth-subtitle">
						Add details that will appear on your profile page.
					</p>

					{feedback.text ? (
						<div className={`auth-message ${feedback.type}`}>{feedback.text}</div>
					) : null}

					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="email">
							Account Email
							<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
						</label>

						<label htmlFor="username">
							Username
							<input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required />
						</label>

						<label htmlFor="fullName">
							Real Name
							<input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required />
						</label>

						<label htmlFor="location">
							Location
							<input id="location" name="location" type="text" value={formData.location} onChange={handleChange} required />
						</label>

						<label htmlFor="cropType">
							Agriculture / Crops You Grow
							<input id="cropType" name="cropType" type="text" value={formData.cropType} onChange={handleChange} required />
						</label>

						<label htmlFor="phone">
							Phone Number
							<input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
						</label>

						<button type="submit" className="auth-button primary">Save and Continue to Login</button>
					</form>

					<p className="auth-switch-text">
						Already completed? <Link to="/login">Go to login</Link>
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

export default CompleteProfile
