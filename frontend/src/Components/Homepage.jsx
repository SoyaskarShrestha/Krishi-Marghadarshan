import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Homepage.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import featuredImage from '../assets/homepage/featured.jpg'
import heroImage from '../assets/homepage/hero.jpg'
import advisoryIcon from '../assets/homepage/icons/advisory.svg'
import advisoryArrowIcon from '../assets/homepage/icons/advisory-arrow.svg'
import articlesIcon from '../assets/homepage/icons/articles.svg'
import articlesArrowIcon from '../assets/homepage/icons/articles-arrow.svg'
import bookmarkIcon from '../assets/homepage/icons/bookmark.svg'
import featureArrowIcon from '../assets/homepage/icons/feature-arrow.svg'
import marketplaceIcon from '../assets/homepage/icons/marketplace.svg'
import marketplaceArrowIcon from '../assets/homepage/icons/marketplace-arrow.svg'
import productImage1 from '../assets/homepage/product-1.jpg'
import productImage2 from '../assets/homepage/product-2.jpg'
import productImage3 from '../assets/homepage/product-3.jpg'
import weatherIcon from '../assets/homepage/icons/weather.svg'
import weatherArrowIcon from '../assets/homepage/icons/weather-arrow.svg'

const quickAccess = [
	{
		title: 'Weather',
		description: ['मौसम: Local agricultural', 'forecasts & alerts.'],
		action: 'Check Now',
		tone: 'weather',
		icon: weatherIcon,
		ctaIcon: weatherArrowIcon,
		href: '/weather',
	},
	{
		title: 'Articles',
		description: ["लेख: Experts' guides for", 'better yields.'],
		action: 'Read More',
		tone: 'articles',
		icon: articlesIcon,
		ctaIcon: articlesArrowIcon,
		href: '/articles',
	},
	{
		title: 'Marketplace',
		description: ['बजार: Buy seeds, tools and', 'sell crops.'],
		action: 'Shop',
		tone: 'marketplace',
		icon: marketplaceIcon,
		ctaIcon: marketplaceArrowIcon,
		href: '/shop',
	},
	{
		title: 'Advisory',
		description: ['सल्लाह: Chat with expert', 'agronomists.'],
		action: 'Ask Experts',
		tone: 'advisory',
		icon: advisoryIcon,
		ctaIcon: advisoryArrowIcon,
		href: '/advisory',
	},
]

const productImages = [productImage1, productImage2, productImage3]

const fallbackProducts = [
	{
		name: 'High-Yield Wheat Seeds',
		category: 'Popular',
		price: 'रू 1,200',
		description: 'Grade A organic seeds, treated for disease resistance.',
		image: productImage1,
		tag: 'Popular',
	},
	{
		name: 'Ergo-Grip Trowel',
		category: 'Field Tool',
		price: 'रू 850',
		description: 'Durable stainless steel tool with ergonomic wooden handle.',
		image: productImage2,
		tag: 'Field Tool',
	},
	{
		name: 'Organic Compost (5kg)',
		category: 'Organic',
		price: 'रू 450',
		description: 'Rich organic nutrient mix for sustainable growth.',
		image: productImage3,
		tag: 'Organic',
	},
]

const fallbackFeaturedArticle = {
	title: 'Mastering Rice Cultivation in Nepal',
	description:
		'Explore the latest sustainable techniques specifically adapted for the diverse topography of Nepal\'s highlands and plains.',
}

function Homepage() {
	const [products, setProducts] = useState(fallbackProducts)
	const [featuredArticle, setFeaturedArticle] = useState(fallbackFeaturedArticle)

	useEffect(() => {
		let ignore = false

		async function loadHomepageData() {
			try {
				const [shopProducts, articles] = await Promise.all([
					apiRequest(API_ENDPOINTS.SHOP_PRODUCTS),
					apiRequest(API_ENDPOINTS.ARTICLES),
				])

				if (!ignore && Array.isArray(shopProducts) && shopProducts.length > 0) {
					setProducts(
						shopProducts.slice(0, 3).map((product, index) => ({
							name: product.name,
							category: product.category,
							price: `रू ${Number(product.price || 0).toLocaleString('en-IN')}`,
							description: product.description,
							image: productImages[index % productImages.length],
							tag: product.badge || product.category || 'Popular',
						}))
					)
				}

				if (!ignore && Array.isArray(articles) && articles.length > 0) {
					const pick = articles.find((article) => article.featured) || articles[0]
					setFeaturedArticle({
						title: pick.title,
						description: pick.description,
					})
				}
			} catch {
				// Keep fallback content if backend is unavailable.
			}
		}

		loadHomepageData()

		return () => {
			ignore = true
		}
	}, [])

	return (
		<div className="home-page" data-node-id="2:455">
			<NavBar showSearch searchPlaceholder="Search..." />

			<main className="home-wrap home-main" data-node-id="2:456">
				<section className="home-hero" data-node-id="2:457">
					<img src={heroImage} alt="Terraced fields" className="home-hero-image" />
					<div className="home-hero-overlay" />
					<div className="home-hero-content">
						<span className="home-hero-badge">Trusted by Nepal&apos;s growers</span>
						<h2>
							<span>Smart Farming</span>
							<span>Made Simple</span>
						</h2>
						<p>कृषि मार्गदर्शन: खेती सरल बनाऔं</p>
						<div className="home-hero-actions">
							<Link className="home-btn home-btn-primary" to="/weather">
								Get Started
							</Link>
							<Link className="home-btn home-btn-ghost" to="/articles">
								Learn More
							</Link>
						</div>
					</div>
					<div className="home-hero-panel">
						<div className="home-hero-panel-chip">Today&apos;s Advisory</div>
						<h3>Best irrigation window: 6:00 AM - 10:30 AM</h3>
						<p>Clear morning, moderate moisture retention, and safer foliar application before noon.</p>
						<Link to="/advisory">View expert guidance</Link>
					</div>
				</section>

				<section className="home-quick-grid" data-node-id="2:469">
					{quickAccess.map((item) => (
						<article className={`home-quick-card ${item.tone}`} key={item.title}>
							<div className="home-icon-shell">
								<img src={item.icon} alt="" aria-hidden="true" />
							</div>
							<h3>{item.title}</h3>
							<p>
								{item.description.map((line) => (
									<span key={line}>{line}</span>
								))}
							</p>
							<Link to={item.href}>
								<span>{item.action}</span>
								<img src={item.ctaIcon} alt="" aria-hidden="true" className="home-quick-link-icon" />
							</Link>
						</article>
					))}
				</section>

				<section className="home-feature" data-node-id="2:518">
					<article className="home-feature-copy">
						<span className="home-pill">Seasonal Insight</span>
						<h3>
							<span>{featuredArticle.title}</span>
						</h3>
						<p>{featuredArticle.description}</p>
						<Link to="/articles" className="home-feature-link">
							<span className="home-circle-arrow">
								<img src={featureArrowIcon} alt="" aria-hidden="true" className="home-feature-arrow-icon" />
							</span>
							View Full Article
						</Link>
					</article>

					<article className="home-feature-card" data-node-id="2:533">
						<img src={featuredImage} alt="Farmer holding rice crop" />
						<div className="home-feature-chip">
							<div className="home-feature-chip-row">
								<div className="home-feature-chip-copy">
									<small className="home-feature-chip-label">New Technique</small>
									<strong className="home-feature-chip-title">The System of Rice Intensification</strong>
									
								</div>
								<span className="home-feature-bookmark-shell" aria-hidden="true">
										<img src={bookmarkIcon} alt="" className="home-feature-bookmark-icon" />
									</span>

							</div>
						</div>
					</article>
				</section>

				<section className="home-market" data-node-id="2:544">
					<div className="home-market-head">
						<div>
							<h3>Marketplace Highlights</h3>
							<p>Top tools and seeds for the upcoming season</p>
						</div>
						<Link to="/shop">See All Products</Link>
					</div>

					<div className="home-product-grid">
						{products.map((product) => (
							<article className="home-product-card" key={product.name}>
								<img src={product.image} alt={product.name} />
								<div className="home-product-copy">
									<span className="home-product-tag">{product.tag}</span>
									<div className="home-product-title-row">
										<h4>{product.name}</h4>
										<strong>{product.price}</strong>
									</div>
									<p><span>{product.description}</span></p>
									<Link to="/shop" className="home-product-button">Add to Cart</Link>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>

			<Footer
				footerClassName="home-footer"
				innerClassName="home-wrap home-footer-inner"
				linksClassName="home-footer-links"
				brand="Krishi Margadarshan"
				copy="© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP"
				wrapBrandCopy
				footerProps={{ 'data-node-id': '2:593' }}
				innerProps={{ 'data-node-id': '2:594' }}
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

export default Homepage
