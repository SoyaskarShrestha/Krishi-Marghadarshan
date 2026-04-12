import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Shop.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
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

const productImages = [productImage1, productImage2, productImage3, productImage4, productImage5, productImage6]
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '')

function resolveProductImage(photo, index) {
	if (typeof photo === 'string' && photo.trim().length > 0) {
		if (photo.startsWith('http://') || photo.startsWith('https://')) {
			return photo
		}

		if (photo.startsWith('/')) {
			return `${apiOrigin}${photo}`
		}

		return `${apiOrigin}/${photo}`
	}

	return productImages[index % productImages.length]
}

function Shop() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()
	const baseCategories = useMemo(
		() => [
			{ value: 'all', label: t('shop.allProducts'), checked: true },
			{ value: 'Organic Seeds', label: t('shop.organicSeeds'), checked: false },
			{ value: 'Bio Fertilizers', label: t('shop.bioFertilizers'), checked: false },
			{ value: 'Modern Tools', label: t('shop.modernTools'), checked: false },
		],
		[t]
	)
	const fallbackProducts = useMemo(
		() =>
			t('shop.fallbackProducts', { returnObjects: true }).map((product, index) => ({
				...product,
				image: productImages[index % productImages.length],
			})),
		[t]
	)
	const categoryLabels = useMemo(
		() => ({
			'Organic Seeds': t('shop.organicSeeds'),
			'Bio Fertilizers': t('shop.bioFertilizers'),
			'Modern Tools': t('shop.modernTools'),
		}),
		[t]
	)
	const [products, setProducts] = useState(fallbackProducts)
	const [isUsingFallbackProducts, setIsUsingFallbackProducts] = useState(true)
	const [shopError, setShopError] = useState('')
	const [actionMessage, setActionMessage] = useState('')
	const [cartCount, setCartCount] = useState(0)
	const [selectedCategories, setSelectedCategories] = useState(() =>
		baseCategories.filter((category) => category.checked).map((category) => category.value)
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
					image: resolveProductImage(product.photo, index),
					badge: product.badge || '',
					badgeTone: product.badge_tone || 'light',
				}))

				if (mapped.length > 0) {
					setProducts(mapped)
				}
				setIsUsingFallbackProducts(false)
				setShopError('')
			} catch {
				if (!ignore) {
					setShopError(t('shop.fallbackError'))
				}
			}
		}

		loadProducts()

		return () => {
			ignore = true
		}
		}, [t])

	useEffect(() => {
		let ignore = false

		async function loadCartCount() {
			try {
				const payload = await apiRequest(API_ENDPOINTS.SHOP_CART)
				if (!Array.isArray(payload) || ignore) {
					return
				}

				const count = payload.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
				setCartCount(count)
			} catch {
				if (!ignore) {
					setCartCount(0)
				}
			}
		}

		loadCartCount()

		return () => {
			ignore = true
		}
	}, [])

	const categories = useMemo(() => {
		const fromProducts = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map((label) => ({
			value: label,
			label: categoryLabels[label] || label,
			checked: false,
		}))

		return [baseCategories[0], ...fromProducts]
	}, [baseCategories, categoryLabels, products])

	const displayProducts = isUsingFallbackProducts ? fallbackProducts : products
	const visibleProducts = useMemo(() => {
		if (selectedCategories.includes('all') || selectedCategories.length === 0) {
			return displayProducts
		}

		return displayProducts.filter((product) => selectedCategories.includes(product.category))
	}, [displayProducts, selectedCategories])

	const handleCategoryChange = (value) => {
		setSelectedCategories((current) =>
			value === 'all'
				? ['all']
				: current.includes(value)
					? current.filter((item) => item !== value && item !== 'all')
					: [...current.filter((item) => item !== 'all'), value]
		)
	}

	const handleAddToCart = async (product) => {
		if (!product.id) {
			setActionMessage(t('shop.sampleOnly'))
			return
		}

		if (!isAuthenticated) {
			setActionMessage('Please login to add products to cart.')
			navigate('/login')
			return
		}

		try {
			await apiRequest(API_ENDPOINTS.SHOP_CART, {
				method: 'POST',
				body: JSON.stringify({ product_id: product.id, quantity: 1 }),
			})
			setCartCount((current) => current + 1)
			setActionMessage(t('shop.addedToCart', { name: product.name }))
		} catch (error) {
			setActionMessage(error.status === 401 ? 'Please login to add products to cart.' : error.message)
		}
	}

	return (
		<div className="shop-page" data-node-id="2:214">
			<NavBar showCart cartCount={cartCount} />

			<main className="shop-shell shop-main" data-node-id="2:215">
				<section className="shop-hero-grid" data-node-id="2:216">
					<article className="shop-hero-banner" data-node-id="2:217">
						<img src={heroImage} alt="Terraced green field landscape" className="shop-hero-image" />
						<div className="shop-hero-overlay" />
						<div className="shop-hero-content">
							<span className="shop-pill">{t('shop.heroBadge')}</span>
							<h2>
								<span>{t('shop.heroTitle.0')}</span>
								<span>{t('shop.heroTitle.1')}</span>
								<span>{t('shop.heroTitle.2')}</span>
							</h2>
							<Link to="/shop" className="shop-hero-cta">
								<span>{t('shop.heroCta')}</span>
								<img src={exploreArrowIcon} alt="" aria-hidden="true" />
							</Link>
						</div>
					</article>

					<div className="shop-side-cards" data-node-id="2:229">
						<article className="shop-side-card advice" data-node-id="2:230">
							<div className="shop-side-card-copy">
								<h3>{t('shop.expertAdviceTitle')}</h3>
								<p>{t('shop.expertAdviceBody')}</p>
							</div>
							<img src={adviceGearIcon} alt="" aria-hidden="true" className="shop-side-card-decor" />
						</article>

						<article className="shop-side-card delivery" data-node-id="2:242">
							<div className="shop-side-card-copy">
								<h3>{t('shop.fastDeliveryTitle')}</h3>
								<p>{t('shop.fastDeliveryBody')}</p>
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
							<h3>{t('shop.categoriesTitle')}</h3>
							<div className="shop-filter-list">
								{categories.map((category) => (
									<label className="shop-filter-item" key={category.value}>
										<input
											type="checkbox"
											checked={selectedCategories.includes(category.value)}
											onChange={() => handleCategoryChange(category.value)}
											className="shop-filter-input"
										/>
										<span className={`shop-filter-box ${selectedCategories.includes(category.value) ? 'checked' : ''}`}>
											{selectedCategories.includes(category.value) ? <img src={checkIcon} alt="" aria-hidden="true" /> : null}
										</span>
										<span>{category.label}</span>
									</label>
								))}
							</div>
						</div>

						<div className="shop-price-card">
							<h3>{t('shop.priceRangeTitle')}</h3>
							<div className="shop-price-bar">
								<span />
							</div>
							<div className="shop-price-labels">
								<span>100</span>
								<span>50,000+</span>
							</div>
						</div>

						<div className="shop-support-card">
							<h4>{t('shop.needSupport')}</h4>
							<p>{t('shop.supportBody')}</p>
							<button type="button">{t('shop.callButton')}</button>
						</div>
					</aside>

					<div className="shop-content" data-node-id="2:298">
						<div className="shop-content-head" data-node-id="2:299">
							<div className="shop-content-title">
								<h3>{t('shop.availableSupplies')}</h3>
								<p>{t('shop.subtitle', { count: visibleProducts.length })}</p>
								{shopError ? <p>{shopError}</p> : null}
								{actionMessage ? <p>{actionMessage}</p> : null}
							</div>

							<div className="shop-sort">
								<span className="shop-sort-label">{t('shop.sortBy')}</span>
								<button type="button" className="shop-sort-select">
									<span>{t('shop.popularity')}</span>
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
											<span>{t('shop.addToCart')}</span>
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
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
				brandClassName="shop-footer-brand"
				copyClassName="shop-footer-copy"
				footerProps={{ 'data-node-id': '2:414' }}
				innerProps={{ 'data-node-id': '2:415' }}
				links={[
					{ to: '/advisory', label: t('common.supportCenters') },
					{ to: '/articles', label: t('common.faq') },
					{ to: '/advisory', label: t('common.privacy') },
					{ to: '/advisory', label: t('common.contact') },
				]}
			/>
		</div>
	)
}

export default Shop








