import { NavLink } from 'react-router-dom'
import './Shop.css'
import heroImage from './assets/homepage/hero.jpg'
import productImage1 from './assets/homepage/product-1.jpg'
import productImage2 from './assets/homepage/product-2.jpg'
import productImage3 from './assets/homepage/product-3.jpg'
import featuredImage from './assets/homepage/featured.jpg'

const filters = ['All Products', 'Organic Seeds', 'Bio Fertilizers', 'Modern Tools']

const products = [
	{
		name: 'Organic Rice Seeds',
		price: '500',
		description: 'High-yield basmati variety optimized for Himalayan mid-hill fields.',
		image: productImage1,
		badge: 'Organic Certified',
		badgeTone: 'green',
	},
	{
		name: 'Precision Trowel',
		price: '1,250',
		description: 'Rust-resistant stainless steel with bamboo ergonomic handle for daily field use.',
		image: productImage2,
		badge: 'Best Seller',
		badgeTone: 'brown',
	},
	{
		name: 'Bio-Root Nutrient',
		price: '890',
		description: 'Enriched with mycorrhiza for explosive root growth and soil vitality.',
		image: productImage3,
		badge: '',
		badgeTone: 'green',
	},
	{
		name: 'Heirloom Tomato',
		price: '350',
		description: 'Non-GMO seeds for sweet, fleshy Himalayan varieties. 50 seeds.',
		image: featuredImage,
		badge: '',
		badgeTone: 'green',
	},
	{
		name: 'Heavy-Duty Spade',
		price: '2,400',
		description: 'Forged steel blade for breaking tough mountain soil. Lifetime-ready.',
		image: heroImage,
		badge: '',
		badgeTone: 'green',
	},
	{
		name: 'Vermicompost Gold',
		price: '450',
		description: 'Pure organic worm castings for rich soil aeration and nutrition.',
		image: productImage3,
		badge: '',
		badgeTone: 'green',
	},
]

function LanguageIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
			<path
				d="M4 5h8M8 5c0 5-2 8-5 10M6 9c1.2 2.1 3 4 5 5M14 5l6 14M16 14h6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function BagIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
			<path
				d="M7 9V7a5 5 0 0 1 10 0v2M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ArrowRightIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
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

function TruckIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
			<path
				d="M3 7h10v8H3zM13 10h3l3 3v2h-6zM7 18a1.5 1.5 0 1 0 0 .01M17 18a1.5 1.5 0 1 0 0 .01"
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
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
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

function CheckIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
			<path
				d="m5 12 4 4 10-10"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ChevronDownIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
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

function CartIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="shop-icon-svg">
			<path
				d="M3 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L19 8H7M10 19a1.4 1.4 0 1 0 0 .01M17 19a1.4 1.4 0 1 0 0 .01"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function Shop() {
	return (
		<div className="shop-page">
			<header className="shop-header">
				<div className="shop-shell shop-header-inner">
					<h1 className="shop-brand">Krishi Margadarshan</h1>

					<nav className="shop-nav" aria-label="Main navigation">
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

					<div className="shop-header-actions">
						<div className="shop-language">
							<span className="shop-language-icon">
								<LanguageIcon />
							</span>
							<span>Language</span>
						</div>
						<NavLink to="/cart" className="shop-bag" aria-label="Cart">
							<BagIcon />
							<span className="shop-bag-count">3</span>
						</NavLink>
					</div>
				</div>
			</header>

			<main className="shop-shell shop-main">
				<section className="shop-hero-grid">
					<article className="shop-hero-banner">
						<img src={heroImage} alt="Terraced green field landscape" />
						<div className="shop-hero-overlay" />
						<div className="shop-hero-content">
							<span className="shop-pill">New Season Arrival</span>
							<h2>
								<span>Premium Organic</span>
								<span>Seeds for</span>
								<span>Nepal&apos;s Soil.</span>
							</h2>
							<button type="button" className="shop-hero-cta">
								<span>Explore Collection</span>
								<span className="shop-cta-arrow">
									<ArrowRightIcon />
								</span>
							</button>
						</div>
					</article>

					<div className="shop-side-cards">
						<article className="shop-side-card advice">
							<h3>Expert Advice</h3>
							<p>Consult with agronomists for your specific crop needs.</p>
						</article>

						<article className="shop-side-card delivery">
							<h3>Fast Delivery</h3>
							<p>To all 77 districts across Nepal.</p>
							<div className="shop-side-icons">
								<span>
									<TruckIcon />
								</span>
								<span>
									<PinIcon />
								</span>
							</div>
						</article>
					</div>
				</section>

				<section className="shop-catalog">
					<aside className="shop-sidebar">
						<h3>Categories</h3>
						<div className="shop-filter-list">
							{filters.map((filter, index) => (
								<div className="shop-filter-item" key={filter}>
									<span className="shop-filter-box">{index === 0 ? <CheckIcon /> : ''}</span>
									<span>{filter}</span>
								</div>
							))}
						</div>

						<div className="shop-price-card">
							<h3>Price Range</h3>
							<div className="shop-price-bar" />
							<div className="shop-price-labels">
								<span>100</span>
								<span>50,000+</span>
							</div>
						</div>

						<div className="shop-support-card">
							<h4>Need Support?</h4>
							<p>Our agricultural experts are available for live consultation.</p>
							<button type="button">Call 1800-AGRI</button>
						</div>
					</aside>

					<div className="shop-content">
						<div className="shop-content-head">
							<div className="shop-content-title">
								<h3>Available Supplies</h3>
								<p>Showing 24 verified organic products</p>
							</div>

							<div className="shop-sort">
								<span className="shop-sort-label">SORT BY:</span>
								<span className="shop-sort-value">Popularity</span>
								<span className="shop-sort-caret">
									<ChevronDownIcon />
								</span>
							</div>
						</div>

						<div className="shop-product-grid">
							{products.map((product) => (
								<article className="shop-product-card" key={product.name}>
									<div className="shop-card-image">
										<img src={product.image} alt={product.name} />
										{product.badge ? (
											<span className={`shop-card-badge ${product.badgeTone === 'brown' ? 'brown' : ''}`}>
												{product.badge}
											</span>
										) : null}
									</div>

									<div className="shop-card-copy">
										<div className="shop-card-title-row">
											<h4>{product.name}</h4>
											<span className="shop-card-price">{product.price}</span>
										</div>
										<p>{product.description}</p>
										<button type="button" className="shop-add-button">
											<span>
												<CartIcon />
											</span>
											<span>Add to Cart</span>
										</button>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>

			<footer className="shop-footer">
				<div className="shop-shell shop-footer-inner">
					<div className="shop-footer-brand">Krishi Margadarshan</div>
					<div className="shop-footer-links">
						<a href="/">Support Centers</a>
						<a href="/">FAQ</a>
						<a href="/">Privacy</a>
						<a href="/">Contact</a>
					</div>
					<div className="shop-footer-copy">© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</div>
				</div>
			</footer>
		</div>
	)
}

export default Shop


