import './Advisory.css'
import NavBar from './NavBar'
import heroImage from '../assets/advisory/hero.png'
import badgeIcon from '../assets/advisory/badge.svg'

const faqItems = [
	{
		title: 'बालीमा लाग्ने कीरा कसरी नियन्त्रण गर्ने ?',
		body: 'पराजैविक विधिको प्रयोग गर्नुहोस् वा नजिकको झोल छर्कनुहोस्। कीरा धेरै लागेमा कृषि कार्यालयमा सम्पर्क गर्नुहोस्।',
	},
	{
		title: 'माटो परीक्षण कहाँ गर्न सकिन्छ ?',
		body: 'तपाईँको नजिकको जिल्ला कृषि ज्ञान केन्द्रमा वा घुम्ती शिविरहरूमा माटोको नमुना बुझाउन सक्नुहुन्छ।',
	},
	{
		title: 'उस्मा समयमा कुन मल प्रयोग गर्ने ?',
		body: 'बाली रोप्नु अघि गोठेमल र बाली बढ्ने बेलामा नाइट्रोजनयुक्त मलको प्रयोग गर्दा उत्पादन राम्रो हुन्छ।',
	},
	{
		title: 'बीउ छनौट गर्दा के कुरामा ध्यान दिने ?',
		body: 'प्रमाणित बीउ मात्र प्रयोग गर्नुहोस्। बीउ खरिद गर्दा म्याद र शुद्धता परीक्षण अनिवार्य जाँच गर्नुहोस्।',
	},
]

const supportCenters = [
	{ title: 'बागमती प्रदेश केन्द्र', detail: 'हेटौँडा, फोन: ०५७-५७०१२३' },
	{ title: 'गण्डकी प्रदेश केन्द्र', detail: 'पोखरा, फोन: ०६१-५४०४५६' },
	{ title: 'कोशी प्रदेश केन्द्र', detail: 'विराटनगर, फोन: ०२१-५४७८९१' },
	{ title: 'लुम्बिनी प्रदेश केन्द्र', detail: 'बुटवल, फोन: ०७१-४८०३२१' },
]

const benefits = [
	{ title: 'निःशुल्क परामर्श', detail: 'सबै साना किसानहरूको लागि पूर्ण रुपमा नि:शुल्क।' },
	{ title: 'सही समाधान', detail: 'अनुभव र विज्ञानमा आधारित सल्लाह।' },
]

function PhoneIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="advisory-icon-svg">
			<path
				d="M7 5h3l1.2 3.2-1.7 1.7a14 14 0 0 0 4.5 4.5l1.7-1.7L19 14v3c0 .6-.4 1-1 1A14 14 0 0 1 6 6c0-.6.4-1 1-1Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function PinIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="advisory-icon-svg">
			<path
				d="M12 21s5-4.8 5-10a5 5 0 1 0-10 0c0 5.2 5 10 5 10Zm0-8.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function CheckCircleIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="advisory-icon-svg">
			<path
				d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.2-9 2.1 2.1 4.4-4.4"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ChevronDownIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="advisory-icon-svg">
			<path
				d="m6 9 6 6 6-6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.9"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ArrowRightIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="advisory-icon-svg">
			<path
				d="M5 12h14M13 6l6 6-6 6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.9"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function Advisory() {
	return (
		<div className="advisory-page">
			<NavBar />

			<main className="advisory-shell advisory-main">
				<section className="advisory-hero">
					<div className="advisory-hero-copy">
						<span className="advisory-pill">विशेषज्ञ सल्लाह</span>
						<h2>
							<span>कृषि विज्ञसँग</span>
							<span>सिधै संवाद गर्नुहोस्</span>
						</h2>
						<p>
							तपाईंका खेतीपाती सम्बन्धी जिज्ञासाहरू हाम्रा विज्ञहरूलाई सोध्नुहोस् र उचित समाधान
							प्राप्त गर्नुहोस्। हामी तपाईंको समृद्धिको साथी हौं।
						</p>
					</div>

					<div className="advisory-hero-image-wrap">
						<img src={heroImage} alt="Farmer standing in a field holding vegetables" className="advisory-hero-image" />
						<div className="advisory-floating-card">
							<span className="advisory-floating-icon">
								<img src={badgeIcon} alt="" aria-hidden="true" />
							</span>
							<div>
								<strong>२४+ विज्ञहरू</strong>
								<p>सहयोगका लागि तयार</p>
							</div>
						</div>
					</div>
				</section>

				<section className="advisory-ask-section">
					<div className="advisory-ask-copy">
						<h3>विज्ञसँग सोध्नुहोस् (Ask a Specialist)</h3>
						<p>
							हाम्रो टोलीमा बाली वैज्ञानिक, माटो विज्ञ र भेटेरिनरी डाक्टरहरू समावेश छन्। तपाईंको
							प्रश्न पठाउनुहोस्, हामी ३ कार्यदिन भित्र जवाफ दिनेछौं।
						</p>
						<div className="advisory-benefit-list">
							{benefits.map((item) => (
								<div className="advisory-benefit" key={item.title}>
									<span className="advisory-benefit-icon"><CheckCircleIcon /></span>
									<div>
										<strong>{item.title}</strong>
										<p>{item.detail}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<form className="advisory-form-card">
						<label>
							<span>तपाईँको नाम (Full Name)</span>
							<input type="text" placeholder="उदाहरण: राम बहादुर" />
						</label>
						<label>
							<span>बालीको प्रकार (Category)</span>
							<div className="advisory-select-wrap">
								<select defaultValue="बालीबाली (Crops)">
									<option>बालीबाली (Crops)</option>
									<option>माटो परीक्षण</option>
									<option>पशुपालन</option>
								</select>
								<span className="advisory-select-icon"><ChevronDownIcon /></span>
							</div>
						</label>
						<label>
							<span>प्रश्न (Your Question)</span>
							<textarea rows="5" placeholder="यहाँ आफ्नो समस्या लेख्नुहोस्..." />
						</label>
						<button type="submit" className="advisory-submit-button">
							<span>सन्देश पठाउनुहोस् (Send Message)</span>
							<span className="advisory-submit-icon"><ArrowRightIcon /></span>
						</button>
					</form>
				</section>

				<section className="advisory-faq-section">
					<div className="advisory-faq-head">
						<h3>बारम्बार सोधिने प्रश्नहरू (FAQs)</h3>
						<div className="advisory-faq-underline" />
					</div>
					<div className="advisory-faq-grid">
						{faqItems.map((item) => (
							<article className="advisory-faq-card" key={item.title}>
								<div className="advisory-faq-title-row">
									<h4>{item.title}</h4>
									<span className="advisory-faq-icon"><ChevronDownIcon /></span>
								</div>
								<p>{item.body}</p>
							</article>
						))}
					</div>
				</section>

				<section className="advisory-support-section">
					<div className="advisory-support-panel">
						<div className="advisory-support-copy">
							<h3>कृषि सहयोग केन्द्रहरू</h3>
							<p>Agricultural Support Centers</p>

							<div className="advisory-support-item">
								<span className="advisory-support-icon"><PhoneIcon /></span>
								<div>
									<small>EMERGENCY HELP LINE</small>
									<strong>1800-AGRI-HELP (१८००-एग्री-हेल्प)</strong>
								</div>
							</div>

							<div className="advisory-support-item">
								<span className="advisory-support-icon"><PinIcon /></span>
								<div>
									<small>CENTRAL OFFICE</small>
									<strong>हरिहरभवन, ललितपुर, नेपाल</strong>
								</div>
							</div>
						</div>

						<div className="advisory-centers-grid">
							{supportCenters.map((center) => (
								<article className="advisory-center-card" key={center.title}>
									<strong>{center.title}</strong>
									<p>{center.detail}</p>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>

			<footer className="advisory-footer">
				<div className="advisory-shell advisory-footer-inner">
					<div>
						<strong>Krishi Margadarshan</strong>
						<p>© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</p>
					</div>
					<div className="advisory-footer-links">
						<a href="/">Support Centers</a>
						<a href="/">FAQ</a>
						<a href="/">Privacy</a>
						<a href="/">Contact</a>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Advisory

