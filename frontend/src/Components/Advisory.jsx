import { useEffect, useMemo, useState } from 'react'
import './Advisory.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import heroImage from '../assets/advisory/hero.png'
import floatingIcon from '../assets/advisory/icon-floating.svg'
import benefitIcon from '../assets/advisory/icon-benefit.svg'
import chevronIcon from '../assets/advisory/icon-chevron.svg'
import arrowIcon from '../assets/advisory/icon-arrow.svg'
import supportPhoneIcon from '../assets/advisory/icon-support-phone.svg'
import supportPinIcon from '../assets/advisory/icon-support-pin.svg'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'

function Advisory() {
	const { isNepali } = useLanguage()
	const { t } = useTranslation()
	const [formState, setFormState] = useState({
		fullName: '',
		category: '',
		question: '',
	})
	const [submitMessage, setSubmitMessage] = useState('')
	const [submitError, setSubmitError] = useState('')
	const [meta, setMeta] = useState(null)

	const content = {
		heroPill: t('advisory.heroPill'),
		heroTitle1: t('advisory.heroTitle.0'),
		heroTitle2: t('advisory.heroTitle.1'),
		heroBody: t('advisory.heroBody'),
		floatingTitle: t('advisory.floatingTitle'),
		floatingBody: t('advisory.floatingBody'),
		askTitle: t('advisory.askTitle'),
		askBody: t('advisory.askBody'),
		benefits: t('advisory.benefits', { returnObjects: true }),
		fullName: t('advisory.fullName'),
		fullNamePlaceholder: t('advisory.fullNamePlaceholder'),
		category: t('advisory.category'),
		categoryDefault: t('advisory.categoryDefault'),
		question: t('advisory.question'),
		questionPlaceholder: t('advisory.questionPlaceholder'),
		send: t('advisory.send'),
		faqTitle: t('advisory.faqTitle'),
		faqs: t('advisory.faqs', { returnObjects: true }),
		supportTitle: t('advisory.supportTitle'),
		supportSub: t('advisory.supportSub'),
		helpLine: t('advisory.helpLine'),
		helpNumber: t('advisory.helpNumber'),
		office: t('advisory.office'),
		officeAddress: t('advisory.officeAddress'),
		centers: t('advisory.centers', { returnObjects: true }),
		footerSupport: t('advisory.footerSupport'),
		footerFaq: t('advisory.footerFaq'),
		footerPrivacy: t('advisory.footerPrivacy'),
		footerContact: t('advisory.footerContact'),
	}

	const languageKey = isNepali ? 'ne' : 'en'

	useEffect(() => {
		let ignore = false

		async function loadMeta() {
			try {
				const payload = await apiRequest(API_ENDPOINTS.ADVISORY_META)
				if (!ignore) {
					setMeta(payload)
				}
			} catch {
				if (!ignore) {
					setMeta(null)
				}
			}
		}

		loadMeta()

		return () => {
			ignore = true
		}
	}, [])

	const availableCategories = useMemo(() => {
		const list = meta?.categories?.[languageKey]
		if (Array.isArray(list) && list.length > 0) {
			return list
		}
		return [content.categoryDefault, t('advisory.soilTesting'), t('advisory.livestock')]
	}, [content.categoryDefault, isNepali, languageKey, meta])

	const faqs = useMemo(() => {
		const list = meta?.faqs?.[languageKey]
		return Array.isArray(list) && list.length > 0 ? list : content.faqs
	}, [content.faqs, languageKey, meta])

	const centers = useMemo(() => {
		const list = meta?.centers?.[languageKey]
		return Array.isArray(list) && list.length > 0 ? list : content.centers
	}, [content.centers, languageKey, meta])

	const selectedCategory = formState.category || availableCategories[0] || content.categoryDefault

	const handleFormChange = (event) => {
		const { name, value } = event.target
		setFormState((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setSubmitMessage('')
		setSubmitError('')

		try {
			const payload = await apiRequest(API_ENDPOINTS.ADVISORY_QUESTIONS, {
				method: 'POST',
				body: JSON.stringify({
					full_name: formState.fullName,
					category: selectedCategory,
					question: formState.question,
					language: languageKey,
				}),
			})

			setSubmitMessage(payload.message)
			setFormState((previous) => ({ ...previous, question: '' }))
		} catch (error) {
			setSubmitError(error.message)
		}
	}

	return (
		<div className="advisory-page">
			<NavBar />

			<main className="advisory-shell advisory-main">
				<section className="advisory-hero">
					<div className="advisory-hero-copy">
						<span className="advisory-pill">{content.heroPill}</span>
						<h2>
							<span>{content.heroTitle1}</span>
							<span>{content.heroTitle2}</span>
						</h2>
						<p>{content.heroBody}</p>
					</div>

					<div className="advisory-hero-image-wrap">
						<img src={heroImage} alt="Farmer standing in a field holding vegetables" className="advisory-hero-image" />
						<div className="advisory-floating-card">
							<span className="advisory-floating-icon">
								<img src={floatingIcon} alt="" aria-hidden="true" />
							</span>
							<div>
								<strong>{content.floatingTitle}</strong>
								<p>{content.floatingBody}</p>
							</div>
						</div>
					</div>
				</section>

				<section className="advisory-ask-section">
					<div className="advisory-ask-copy">
						<h3>{content.askTitle}</h3>
						<p>{content.askBody}</p>
						<div className="advisory-benefit-list">
							{content.benefits.map((item) => (
								<div className="advisory-benefit" key={item.title}>
									<span className="advisory-benefit-icon"><img src={benefitIcon} alt="" aria-hidden="true" /></span>
									<div>
										<strong>{item.title}</strong>
										<p>{item.detail}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<form className="advisory-form-card" onSubmit={handleSubmit}>
						{submitMessage ? <p>{submitMessage}</p> : null}
						{submitError ? <p>{submitError}</p> : null}
						<label>
							<span>{content.fullName}</span>
							<input
								type="text"
								name="fullName"
								placeholder={content.fullNamePlaceholder}
								value={formState.fullName}
								onChange={handleFormChange}
								required
							/>
						</label>
						<label>
							<span>{content.category}</span>
							<div className="advisory-select-wrap">
								<select name="category" value={selectedCategory} onChange={handleFormChange}>
									{availableCategories.map((item) => (
										<option key={item} value={item}>{item}</option>
									))}
								</select>
								<span className="advisory-select-icon"><img src={chevronIcon} alt="" aria-hidden="true" /></span>
							</div>
						</label>
						<label>
							<span>{content.question}</span>
							<textarea
								rows="5"
								name="question"
								placeholder={content.questionPlaceholder}
								value={formState.question}
								onChange={handleFormChange}
								required
							/>
						</label>
						<button type="submit" className="advisory-submit-button">
							<span>{content.send}</span>
							<span className="advisory-submit-icon"><img src={arrowIcon} alt="" aria-hidden="true" /></span>
						</button>
					</form>
				</section>

				<section className="advisory-faq-section">
					<div className="advisory-faq-head">
						<h3>{content.faqTitle}</h3>
						<div className="advisory-faq-underline" />
					</div>
					<div className="advisory-faq-grid">
						{faqs.map((item) => (
							<article className="advisory-faq-card" key={item.title}>
								<div className="advisory-faq-title-row">
									<h4>{item.title}</h4>
									<span className="advisory-faq-icon"><img src={chevronIcon} alt="" aria-hidden="true" /></span>
								</div>
								<p>{item.body}</p>
							</article>
						))}
					</div>
				</section>

				<section className="advisory-support-section">
					<div className="advisory-support-panel">
						<div className="advisory-support-copy">
							<h3>{content.supportTitle}</h3>
							<p>{content.supportSub}</p>

							<div className="advisory-support-item">
								<span className="advisory-support-icon"><img src={supportPhoneIcon} alt="" aria-hidden="true" /></span>
								<div>
									<small>{content.helpLine}</small>
									<strong>{content.helpNumber}</strong>
								</div>
							</div>

							<div className="advisory-support-item">
								<span className="advisory-support-icon"><img src={supportPinIcon} alt="" aria-hidden="true" /></span>
								<div>
									<small>{content.office}</small>
									<strong>{content.officeAddress}</strong>
								</div>
							</div>
						</div>

						<div className="advisory-centers-grid">
							{centers.map((center) => (
								<article className="advisory-center-card" key={center.title}>
									<strong>{center.title}</strong>
									<p>{center.detail}</p>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer
				footerClassName="advisory-footer"
				innerClassName="advisory-shell advisory-footer-inner"
				linksClassName="advisory-footer-links"
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
				wrapBrandCopy
				links={[
					{ to: '/advisory', label: content.footerSupport },
					{ to: '/articles', label: content.footerFaq },
					{ to: '/advisory', label: content.footerPrivacy },
					{ to: '/advisory', label: content.footerContact },
				]}
			/>
		</div>
	)
}

export default Advisory

