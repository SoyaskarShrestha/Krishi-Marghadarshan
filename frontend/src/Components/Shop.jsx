import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Shop.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import heroImage from '../assets/shop/hero.png'
import exploreArrowIcon from '../assets/shop/icons/explore-arrow.svg'
import adviceGearIcon from '../assets/shop/icons/advice-gear.svg'
import truckIcon from '../assets/shop/icons/truck.svg'
import pinIcon from '../assets/shop/icons/pin.svg'
import checkIcon from '../assets/shop/icons/check.svg'
import cartIcon from '../assets/shop/icons/cart.svg'
import sortIcon from '../assets/shop/icon-sort.svg'
import productImage1 from '../assets/shop/product-1.jpg'
import productImage2 from '../assets/shop/product-2.jpg'
import productImage3 from '../assets/shop/product-3.jpg'
import productImage4 from '../assets/shop/product-4.jpg'
import productImage5 from '../assets/shop/product-5.jpg'
import productImage6 from '../assets/shop/product-6.jpg'

const baseCategories = [
	{ label: 'All Products', checked: true },
	{ label: 'Organic Seeds', checked: false },
	{ label: 'Bio Fertilizers', checked: false },
	{ label: 'Modern Tools', checked: false },
]

const productImages = [productImage1, productImage2, productImage3, productImage4, productImage5, productImage6]

const fallbackProducts = [
	{
		name: 'Organic Rice Seeds',
		category: 'Organic Seeds',
		price: '500',
		description: 'High-yield basmati variety optimized for Himalayan mid-hill…',
		image: productImage1,
		badge: 'Organic Certified',
		badgeTone: 'light',
	},
	{
		name: 'Precision Trowel',
		category: 'Modern Tools',
		price: '1,250',
		description: 'Rust-resistant stainless steel with bamboo ergonomic handle for…',
		image: productImage2,
		badge: 'Best Seller',
		badgeTone: 'brown',
	},
	{
		name: 'Bio-Root Nutrient',
		category: 'Bio Fertilizers',
		price: '890',
		description: 'Enriched with mycorrhiza for explosive root growth and soil…',
		image: productImage3,
		badge: '',
		badgeTone: 'light',
	},
	{
		name: 'Heirloom Tomato',
		category: 'Organic Seeds',
		price: '350',
		description: 'Non-GMO seeds for sweet, fleshy Himalayan varieties. 50 seeds.',
		image: productImage4,
		badge: '',
		badgeTone: 'light',
	},
	{
		name: 'Heavy-Duty Spade',
		category: 'Modern Tools',
		price: '2,400',
		description: 'Forged steel blade for breaking tough mountain soil. Lifetime…',
		image: productImage5,
		badge: '',
		badgeTone: 'light',
	},
	{
		name: 'Vermicompost Gold',
		category: 'Bio Fertilizers',
		price: '450',
		description: 'Pure organic worm castings for rich soil aeration and nutrition.…',
		image: productImage6,
		badge: '',
		badgeTone: 'light',
	},
]

function Shop() {
	const [products, setProducts] = useState(fallbackProducts)
	const [shopError, setShopError] = useState('')
	const [actionMessage, setActionMessage] = useState('')
	const [selectedCategories, setSelectedCategories] = useState(() =>
		baseCategories.filter((category) => category.checked).map((category) => category.label)
	)

	useEffect(() => {
		let ignore = false

		async function loadProducts() {
			try {
				const payload = await apiRequest(API_ENDPOINTS.SHOP_PRODUCTS)
				if (!Array.isArray(payload) || ignore) {
					return
				}

				const mapped = payload.map((product, index) => ({
					id: product.id,
					name: product.name,
					category: product.category || 'General',
					price: Number(product.price || 0).toLocaleString('en-IN'),
					description: product.description,
					image: productImages[index % productImages.length],
					badge: product.badge || '',
					badgeTone: product.badge_tone || 'light',
				}))

				if (mapped.length > 0) {
					setProducts(mapped)
				}
				setShopError('')
			} catch {
				if (!ignore) {
					setShopError('Showing sample products because API is not reachable.')
				}
			}
		}

		loadProducts()

		return () => {
			ignore = true
		}
	}, [])

	const categories = useMemo(() => {
		const fromProducts = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map((label) => ({
			label,
			checked: false,
		}))

		return [{ label: 'All Products', checked: true }, ...fromProducts]
	}, [products])

	const visibleProducts = useMemo(() => {
		if (selectedCategories.includes('All Products') || selectedCategories.length === 0) {
			return products
		}

		return products.filter((product) => selectedCategories.includes(product.category))
	}, [products, selectedCategories])

	const handleCategoryChange = (label) => {
		setSelectedCategories((current) =>
			label === 'All Products'
				? ['All Products']
				: current.includes(label)
					? current.filter((item) => item !== label && item !== 'All Products')
					: [...current.filter((item) => item !== 'All Products'), label]
		)
	}

	const handleAddToCart = async (product) => {
		if (!product.id) {
			setActionMessage('Sample item cannot be synced to cart.')
			return
		}

		try {
			await apiRequest(API_ENDPOINTS.SHOP_CART, {
				method: 'POST',
				body: JSON.stringify({ product_id: product.id, quantity: 1 }),
			})
			setActionMessage(`${product.name} added to cart.`)
		} catch (error) {
			setActionMessage(error.message)
		}
	}

	return (
		<div className="shop-page" data-node-id="2:214">
			<NavBar showCart cartCount={3} />

			<main className="shop-shell shop-main" data-node-id="2:215">
				<section className="shop-hero-grid" data-node-id="2:216">
					<article className="shop-hero-banner" data-node-id="2:217">
						<img src={heroImage} alt="Terraced green field landscape" className="shop-hero-image" />
						<div className="shop-hero-overlay" />
						<div className="shop-hero-content">
							<span className="shop-pill">New Season Arrival</span>
							<h2>
								<span>Premium Organic</span>
								<span>Seeds for</span>
								<span>Nepal&apos;s Soil.</span>
							</h2>
							<Link to="/shop" className="shop-hero-cta">
								<span>Explore Collection</span>
								<img src={exploreArrowIcon} alt="" aria-hidden="true" />
							</Link>
						</div>
					</article>

					<div className="shop-side-cards" data-node-id="2:229">
						<article className="shop-side-card advice" data-node-id="2:230">
							<div className="shop-side-card-copy">
								<h3>Expert Advice</h3>
								<p>Consult with agronomists for your specific crop needs.</p>
							</div>
							<img src={adviceGearIcon} alt="" aria-hidden="true" className="shop-side-card-decor" />
						</article>

						<article className="shop-side-card delivery" data-node-id="2:242">
							<div className="shop-side-card-copy">
								<h3>Fast Delivery</h3>
								<p>To all 77 districts across Nepal.</p>
								<div className="shop-side-icons">
									<img src={truckIcon} alt="" aria-hidden="true" />
									<img src={pinIcon} alt="" aria-hidden="true" />
								</div>
							</div>
						</article>
					</div>
				</section>

				<section className="shop-catalog" data-node-id="2:249">
					<aside className="shop-sidebar" data-node-id="2:250">
						<div className="shop-sidebar-group">
							<h3>Categories</h3>
							<div className="shop-filter-list">
								{categories.map((category) => (
									<label className="shop-filter-item" key={category.label}>
										<input
											type="checkbox"
											checked={selectedCategories.includes(category.label)}
											onChange={() => handleCategoryChange(category.label)}
											className="shop-filter-input"
										/>
										<span className={`shop-filter-box ${selectedCategories.includes(category.label) ? 'checked' : ''}`}>
											{selectedCategories.includes(category.label) ? <img src={checkIcon} alt="" aria-hidden="true" /> : null}
										</span>
										<span>{category.label}</span>
									</label>
								))}
							</div>
						</div>

						<div className="shop-price-card">
							<h3>Price Range</h3>
							<div className="shop-price-bar">
								<span />
							</div>
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

					<div className="shop-content" data-node-id="2:298">
						<div className="shop-content-head" data-node-id="2:299">
							<div className="shop-content-title">
								<h3>Available Supplies</h3>
								<p>Showing {visibleProducts.length} verified organic products</p>
								{shopError ? <p>{shopError}</p> : null}
								{actionMessage ? <p>{actionMessage}</p> : null}
							</div>

							<div className="shop-sort">
								<span className="shop-sort-label">SORT BY:</span>
								<button type="button" className="shop-sort-select">
									<span>Popularity</span>
									<img src={sortIcon} alt="" aria-hidden="true" />
								</button>
							</div>
						</div>

						<div className="shop-product-grid" data-node-id="2:314">
							{visibleProducts.map((product, index) => (
								<article className="shop-product-card" key={product.name} data-node-id={`2:${315 + index * 18}`}>
									<div className="shop-card-image">
										<img src={product.image} alt={product.name} />
										{product.badge ? <span className={`shop-card-badge ${product.badgeTone === 'brown' ? 'brown' : ''}`}>{product.badge}</span> : null}
									</div>

									<div className="shop-card-copy">
										<div className="shop-card-title-row">
											<h4>{product.name}</h4>
											<span className="shop-card-price">{product.price}</span>
										</div>
										<p>{product.description}</p>
										<button type="button" className="shop-add-button" onClick={() => handleAddToCart(product)}>
											<img src={cartIcon} alt="" aria-hidden="true" />
											<span>Add to Cart</span>
										</button>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer
				footerClassName="shop-footer"
				innerClassName="shop-shell shop-footer-inner"
				linksClassName="shop-footer-links"
				brand="Krishi Margadarshan"
				copy="© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP"
				brandClassName="shop-footer-brand"
				copyClassName="shop-footer-copy"
				footerProps={{ 'data-node-id': '2:414' }}
				innerProps={{ 'data-node-id': '2:415' }}
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

export default Shop








