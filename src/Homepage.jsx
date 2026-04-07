import { NavLink } from 'react-router-dom'
import './Homepage.css'
import featuredImage from './assets/homepage/featured.jpg'
import heroImage from './assets/homepage/hero.jpg'
import advisoryIcon from './assets/homepage/icons/advisory.png'
import articlesIcon from './assets/homepage/icons/articles.png'
import marketplaceIcon from './assets/homepage/icons/marketplace.png'
import productImage1 from './assets/homepage/product-1.jpg'
import productImage2 from './assets/homepage/product-2.jpg'
import productImage3 from './assets/homepage/product-3.jpg'
import weatherIcon from './assets/homepage/icons/weather.png'

const quickAccess = [
	{
		title: 'Weather',
		description: ['मौसम: Local agricultural', 'forecasts & alerts.'],
		action: 'Check Now',
		tone: 'weather',
		icon: 'weather',
	},
	{
		title: 'Articles',
		description: ["लेख: Experts' guides for", 'better yields.'],
		action: 'Read More',
		tone: 'articles',
		icon: 'articles',
	},
	{
		title: 'Marketplace',
		description: ['बजार: Buy seeds, tools and', 'sell crops.'],
		action: 'Shop',
		tone: 'marketplace',
		icon: 'marketplace',
	},
	{
		title: 'Advisory',
		description: ['सल्लाह: Chat with expert', 'agronomists.'],
		action: 'Ask Experts',
		tone: 'advisory',
		icon: 'advisory',
	},
]

const iconMap = {
	weather: weatherIcon,
	articles: articlesIcon,
	marketplace: marketplaceIcon,
	advisory: advisoryIcon,
}

const products = [
	{
		name: 'High-Yield Wheat Seeds',
		price: 'रू 1,200',
		description: ['Grade A organic seeds, treated for disease', 'resistance.'],
		image: productImage1,
	},
	{
		name: 'Ergo-Grip Trowel',
		price: 'रू 850',
		description: ['Durable stainless steel tool with ergonomic', 'wooden handle.'],
		image: productImage2,
	},
	{
		name: 'Organic Compost (5kg)',
		price: 'रू 450',
		description: ['Rich organic nutrient mix for sustainable growth.'],
		image: productImage3,
	},
]

function Homepage() {
	return (
		<div className="home-page" data-node-id="2:455">
			<header className="home-header" data-node-id="2:607">
				<div className="home-wrap home-header-inner" data-node-id="2:608">
					<div className="home-brand-group">
						<h1 className="home-brand">Krishi Margadarshan</h1>
						<div className="home-search" role="search" aria-label="Search">
							<span className="home-search-icon">⌕</span>
							<span>Search...</span>
						</div>
					</div>

					<nav className="home-nav" aria-label="Main navigation">
						<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
							Home
						</NavLink>
						<NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>
							Weather
						</NavLink>
						<NavLink to="/articles" className={({ isActive }) => (isActive ? 'active' : '')}>
							Articles
						</NavLink>
						<NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
							Shop
						</NavLink>
						<NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
							Profile
						</NavLink>
					</nav>

					<button className="home-language" type="button">
						<span>⌘</span>
						Language
					</button>
				</div>
			</header>

			<main className="home-wrap home-main" data-node-id="2:456">
				<section className="home-hero" data-node-id="2:457">
					<img src={heroImage} alt="Terraced fields" className="home-hero-image" />
					<div className="home-hero-overlay" />
					<div className="home-hero-content">
						<h2>
							<span>Smart Farming</span>
							<span>Made Simple</span>
						</h2>
						<p>कृषि मार्गदर्शन: खेती सरल बनाऔं</p>
						<div className="home-hero-actions">
							<button className="home-btn home-btn-primary" type="button">
								Get Started
							</button>
							<button className="home-btn home-btn-ghost" type="button">
								Learn More
							</button>
						</div>
					</div>
				</section>

				<section className="home-quick-grid" data-node-id="2:469">
					{quickAccess.map((item) => (
						<article className={`home-quick-card ${item.tone}`} key={item.title}>
							<div className="home-icon-shell">
								<img src={iconMap[item.icon]} alt="" aria-hidden="true" />
							</div>
							<h3>{item.title}</h3>
							<p>
								{item.description.map((line) => (
									<span key={line}>{line}</span>
								))}
							</p>
							<a href="#">
								{item.action} <span>→</span>
							</a>
						</article>
					))}
				</section>

				<section className="home-feature" data-node-id="2:518">
					<article className="home-feature-copy">
						<span className="home-pill">Seasonal Insight</span>
						<h3>
							<span>Mastering Rice</span>
							<span>Cultivation in Nepal</span>
						</h3>
						<p>
							Explore the latest sustainable techniques specifically adapted for the
							diverse topography of Nepal&apos;s highlands and plains.
						</p>
						<a href="#" className="home-feature-link">
							<span className="home-circle-arrow">→</span>
							View Full Article
						</a>
					</article>

					<article className="home-feature-card" data-node-id="2:533">
						<img src={featuredImage} alt="Farmer holding rice crop" />
						<div className="home-feature-chip">
							<small>New Technique</small>
							<strong>The System of Rice Intensification</strong>
						</div>
					</article>
				</section>

				<section className="home-market" data-node-id="2:544">
					<div className="home-market-head">
						<div>
							<h3>Marketplace Highlights</h3>
							<p>Top tools and seeds for the upcoming season</p>
						</div>
						<a href="#">See All Products</a>
					</div>

					<div className="home-product-grid">
						{products.map((product) => (
							<article className="home-product-card" key={product.name}>
								<img src={product.image} alt={product.name} />
								<div className="home-product-copy">
									<div className="home-product-title-row">
										<h4>{product.name}</h4>
										<strong>{product.price}</strong>
									</div>
									<p>
										{product.description.map((line) => (
											<span key={line}>{line}</span>
										))}
									</p>
									<button type="button">Add to Cart</button>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>

			<footer className="home-footer" data-node-id="2:593">
				<div className="home-wrap home-footer-inner" data-node-id="2:594">
					<div>
						<strong>Krishi Margadarshan</strong>
						<p>© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</p>
					</div>
					<div className="home-footer-links">
						<a href="#">Support Centers</a>
						<a href="#">FAQ</a>
						<a href="#">Privacy</a>
						<a href="#">Contact</a>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Homepage
