import { useEffect, useMemo, useState } from 'react'
import './Advisory.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { apiRequest } from '../lib/api'
import heroImage from '../assets/advisory/hero.png'
import floatingIcon from '../assets/advisory/icon-floating.svg'
import benefitIcon from '../assets/advisory/icon-benefit.svg'
import chevronIcon from '../assets/advisory/icon-chevron.svg'
import arrowIcon from '../assets/advisory/icon-arrow.svg'
import supportPhoneIcon from '../assets/advisory/icon-support-phone.svg'
import supportPinIcon from '../assets/advisory/icon-support-pin.svg'
import { useLanguage } from '../context/LanguageContext'

function Advisory() {
	const { isNepali } = useLanguage()
	const [formState, setFormState] = useState({
		fullName: '',
		category: '',
		question: '',
	})
	const [submitMessage, setSubmitMessage] = useState('')
	const [submitError, setSubmitError] = useState('')
	const [meta, setMeta] = useState(null)

	const content = isNepali
		? {
			heroPill: 'विशेषज्ञ सल्लाह',
			heroTitle1: 'कृषि विज्ञसँग',
			heroTitle2: 'सिधै संवाद गर्नुहोस्',
			heroBody:
				'तपाईंका खेतीपाती सम्बन्धी जिज्ञासाहरू हाम्रा विज्ञहरूलाई सोध्नुहोस् र उचित समाधान प्राप्त गर्नुहोस्। हामी तपाईंको समृद्धिको साथी हौं।',
			floatingTitle: '२४+ विज्ञहरू',
			floatingBody: 'सहयोगका लागि तयार',
			askTitle: 'विज्ञसँग सोध्नुहोस्',
			askBody:
				'हाम्रो टोलीमा बाली वैज्ञानिक, माटो विज्ञ र भेटेरिनरी डाक्टरहरू समावेश छन्। तपाईंको प्रश्न पठाउनुहोस्, हामी ३ कार्यदिन भित्र जवाफ दिनेछौं।',
			benefits: [
				{ title: 'नि:शुल्क परामर्श', detail: 'सबै साना किसानहरूको लागि पूर्ण रूपमा नि:शुल्क।' },
				{ title: 'सही समाधान', detail: 'अनुभव र विज्ञानमा आधारित सल्लाह।' },
			],
			fullName: 'तपाईंको नाम',
			fullNamePlaceholder: 'उदाहरण: राम बहादुर',
			category: 'बालीको प्रकार',
			categoryDefault: 'बालीनाली (Crops)',
			question: 'प्रश्न',
			questionPlaceholder: 'यहाँ आफ्नो समस्या लेख्नुहोस्...',
			send: 'सन्देश पठाउनुहोस्',
			faqTitle: 'बारम्बार सोधिने प्रश्नहरू',
			faqs: [
				{
					title: 'बालीमा लाग्ने कीरा कसरी नियन्त्रण गर्ने?',
					body: 'प्राङ्गारिक विषादीको प्रयोग गर्नुहोस् वा निमको झोल छर्कनुहोस्। कीरा धेरै लागेमा कृषि कार्यालयमा सम्पर्क गर्नुहोस्।',
				},
				{
					title: 'माटो परीक्षण कहाँ गर्न सकिन्छ?',
					body: 'तपाईंको नजिकको जिल्ला कृषि ज्ञान केन्द्रमा वा घुम्ती शिविरहरूमा माटोको नमुना बुझाउन सक्नुहुन्छ।',
				},
				{
					title: 'उर्वर समयमा कुन मल प्रयोग गर्ने?',
					body: 'बाली रोप्नु अघि गोठेमल र बाली बढ्ने बेलामा नाइट्रोजनयुक्त मलको प्रयोग गर्दा उत्पादन राम्रो हुन्छ।',
				},
				{
					title: 'बीउ छनोट गर्दा के कुरामा ध्यान दिने?',
					body: 'प्रमाणित बीउ मात्र प्रयोग गर्नुहोस्। बीउ खरिद गर्दा म्याद र शुद्धता प्रतिशत अनिवार्य जाँच गर्नुहोस्।',
				},
			],
			supportTitle: 'कृषि सहयोग केन्द्रहरू',
			supportSub: 'कृषि सहायता केन्द्र',
			helpLine: 'आपतकालीन सहायता लाइन',
			helpNumber: '1800-AGRI-HELP (फ्री नम्बर)',
			office: 'केन्द्रीय कार्यालय',
			officeAddress: 'हरिहरभवन, ललितपुर, नेपाल',
			centers: [
				{ title: 'बागमती प्रदेश केन्द्र', detail: 'हेटौँडा, फोन: ०५७-५२०१२३' },
				{ title: 'गण्डकी प्रदेश केन्द्र', detail: 'पोखरा, फोन: ०६१-४६०४५६' },
				{ title: 'कोशी प्रदेश केन्द्र', detail: 'विराटनगर, फोन: ०२१-५५०७८९' },
				{ title: 'लुम्बिनी प्रदेश केन्द्र', detail: 'बुटवल, फोन: ०७१-५४०३२१' },
			],
			footerSupport: 'सहयोग केन्द्र',
			footerFaq: 'प्रश्नोत्तर',
			footerPrivacy: 'गोपनीयता',
			footerContact: 'सम्पर्क',
		}
		: {
			heroPill: 'Expert Advisory',
			heroTitle1: 'Talk Directly with',
			heroTitle2: 'Agriculture Experts',
			heroBody:
				'Ask our specialists about your farming challenges and receive practical recommendations for better yield and crop health.',
			floatingTitle: '24+ Experts',
			floatingBody: 'Ready to help',
			askTitle: 'Ask a Specialist',
			askBody:
				'Our team includes crop scientists, soil experts, and veterinary specialists. Send your question and we will respond within 3 working days.',
			benefits: [
				{ title: 'Free Consultation', detail: 'Completely free support for smallholder farmers.' },
				{ title: 'Accurate Solutions', detail: 'Recommendations based on science and field experience.' },
			],
			fullName: 'Full Name',
			fullNamePlaceholder: 'Example: Ram Bahadur',
			category: 'Category',
			categoryDefault: 'Crops',
			question: 'Your Question',
			questionPlaceholder: 'Describe your farming issue here...',
			send: 'Send Message',
			faqTitle: 'Frequently Asked Questions',
			faqs: [
				{
					title: 'How do I control crop pests naturally?',
					body: 'Use organic pesticides or neem-based sprays. For severe infestations, contact your nearest agricultural support office.',
				},
				{
					title: 'Where can I get soil testing done?',
					body: 'You can submit soil samples at your district agriculture knowledge center or nearby mobile testing camps.',
				},
				{
					title: 'Which fertilizer is best during planting?',
					body: 'Apply compost before planting and nitrogen-rich fertilizers during crop growth for better productivity.',
				},
				{
					title: 'What to check while selecting seeds?',
					body: 'Use only certified seeds and always verify expiry date and purity percentage before purchase.',
				},
			],
			supportTitle: 'Agricultural Support Centers',
			supportSub: 'Regional guidance and emergency help',
			helpLine: 'Emergency Help Line',
			helpNumber: '1800-AGRI-HELP (Toll Free)',
			office: 'Central Office',
			officeAddress: 'Harihar Bhawan, Lalitpur, Nepal',
			centers: [
				{ title: 'Bagmati Province Center', detail: 'Hetauda, Phone: 057-520123' },
				{ title: 'Gandaki Province Center', detail: 'Pokhara, Phone: 061-460456' },
				{ title: 'Koshi Province Center', detail: 'Biratnagar, Phone: 021-550789' },
				{ title: 'Lumbini Province Center', detail: 'Butwal, Phone: 071-540321' },
			],
			footerSupport: 'Support Centers',
			footerFaq: 'FAQ',
			footerPrivacy: 'Privacy',
			footerContact: 'Contact',
		}

	const languageKey = isNepali ? 'ne' : 'en'

	useEffect(() => {
		let ignore = false

		async function loadMeta() {
			try {
				const payload = await apiRequest('/advisory/meta/')
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
		return [content.categoryDefault, isNepali ? 'माटो परीक्षण' : 'Soil Testing', isNepali ? 'पशुपालन' : 'Livestock']
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
			const payload = await apiRequest('/advisory/questions/', {
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
				brand={isNepali ? 'कृषि मार्गदर्शन' : 'Krishi Margadarshan'}
				copy={isNepali ? '© २०२४ कृषि मार्गदर्शन। सहायता: 1800-AGRI-HELP' : '© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP'}
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

