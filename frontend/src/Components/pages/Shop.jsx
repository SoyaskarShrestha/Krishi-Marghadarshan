import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Shop.css'
import NavBar from '../layout/NavBar'
import Footer from '../layout/Footer'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import heroImage from '../../assets/shop/hero.png'
import exploreArrowIcon from '../../assets/shop/icons/explore-arrow.svg'
import adviceGearIcon from '../../assets/shop/icons/advice-gear.svg'
import truckIcon from '../../assets/shop/icons/truck.svg'
import pinIcon from '../../assets/shop/icons/pin.svg'
import checkIcon from '../../assets/shop/icons/check.svg'
import cartIcon from '../../assets/shop/icons/cart.svg'
import sortIcon from '../../assets/shop/icon-sort.svg'
import productImage1 from '../../assets/shop/product-1.jpg'
import productImage2 from '../../assets/shop/product-2.jpg'
import productImage3 from '../../assets/shop/product-3.jpg'
import productImage4 from '../../assets/shop/product-4.jpg'
import productImage5 from '../../assets/shop/product-5.jpg'
import productImage6 from '../../assets/shop/product-6.jpg'

const productImages = [productImage1, productImage2, productImage3, productImage4, productImage5, productImage6]
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '')

function parsePriceValue(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}

	const numericValue = Number.parseFloat(String(value || '').replace(/[^0-9.]/g, ''))
	return Number.isFinite(numericValue) ? numericValue : 0
}

function formatPriceValue(value) {
	return new Intl.NumberFormat('en-IN').format(Math.max(0, Number(value) || 0))
}

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
				priceValue: parsePriceValue(product.price),
				priceDisplay: typeof product.price === 'string' ? product.price : formatPriceValue(product.price),
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
	const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
	const [sortMode, setSortMode] = useState('popularity')
	const [activePriceThumb, setActivePriceThumb] = useState('max')
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
					priceValue: parsePriceValue(product.price),
					priceDisplay: formatPriceValue(product.price),
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
	const uniqueProducts = useMemo(() => {
		const seen = new Set()
		return displayProducts.filter((product, index) => {
			const identity = product.id != null ? `id:${product.id}` : `name:${product.name}-${index}`
			if (seen.has(identity)) {
				return false
			}

			seen.add(identity)
			return true
		})
	}, [displayProducts])
	const priceBounds = useMemo(() => {
		const prices = uniqueProducts.map((product) => Number(product.priceValue) || 0)
		if (prices.length === 0) {
			return { min: 0, max: 100000 }
		}

		return {
			min: Math.floor(Math.min(...prices)),
			max: Math.ceil(Math.max(...prices)),
		}
	}, [uniqueProducts])
	const isPriceRangeLocked = priceBounds.min === priceBounds.max
	const normalizedPriceRange = useMemo(() => {
		if (isPriceRangeLocked) {
			return { min: priceBounds.min, max: priceBounds.max }
		}

		const clampedMin = Math.min(Math.max(priceRange.min, priceBounds.min), priceBounds.max)
		const clampedMax = Math.min(Math.max(priceRange.max, priceBounds.min), priceBounds.max)

		if (clampedMin <= clampedMax) {
			return { min: clampedMin, max: clampedMax }
		}

		return { min: clampedMax, max: clampedMin }
	}, [isPriceRangeLocked, priceBounds.max, priceBounds.min, priceRange.max, priceRange.min])

	const visibleProducts = useMemo(() => {
		return uniqueProducts.filter((product) => {
			const matchesCategory = selectedCategories.includes('all') || selectedCategories.length === 0 || selectedCategories.includes(product.category)
			const numericPrice = Number(product.priceValue) || 0
			const matchesPrice = numericPrice >= normalizedPriceRange.min && numericPrice <= normalizedPriceRange.max
			return matchesCategory && matchesPrice
		})
	}, [normalizedPriceRange.max, normalizedPriceRange.min, selectedCategories, uniqueProducts])
	const sortedProducts = useMemo(() => {
		const items = [...visibleProducts]

		switch (sortMode) {
			case 'price-low-high':
				return items.sort((left, right) => (Number(left.priceValue) || 0) - (Number(right.priceValue) || 0))
			case 'price-high-low':
				return items.sort((left, right) => (Number(right.priceValue) || 0) - (Number(left.priceValue) || 0))
			case 'name-az':
				return items.sort((left, right) => left.name.localeCompare(right.name))
			default:
				return items
		}
	}, [sortMode, visibleProducts])

	const handleCategoryChange = (value) => {
		setSelectedCategories((current) =>
			value === 'all'
				? ['all']
				: current.includes(value)
					? current.filter((item) => item !== value && item !== 'all')
					: [...current.filter((item) => item !== 'all'), value]
		)
	}

	const handlePriceChange = (field, rawValue) => {
		if (isPriceRangeLocked) {
			return
		}

		const value = Number(rawValue)
		setPriceRange((current) => {
			if (field === 'min') {
				return { min: Math.min(value, current.max), max: current.max }
			}

			return { min: current.min, max: Math.max(value, current.min) }
		})
	}

	const handlePriceDragStart = (field) => {
		setActivePriceThumb(field)
	}

	const handlePriceDragEnd = () => {
		setActivePriceThumb('max')
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
							<div className="shop-price-slider-head">
								<span>{formatPriceValue(normalizedPriceRange.min)}</span>
								<span>{formatPriceValue(normalizedPriceRange.max)}</span>
							</div>
							<div className="shop-price-slider-group">
								<input
									type="range"
									min={priceBounds.min}
									max={priceBounds.max}
									step={1}
									value={normalizedPriceRange.min}
									onChange={(event) => handlePriceChange('min', event.target.value)}
									onMouseDown={() => handlePriceDragStart('min')}
									onTouchStart={() => handlePriceDragStart('min')}
									onMouseUp={handlePriceDragEnd}
									onTouchEnd={handlePriceDragEnd}
									disabled={isPriceRangeLocked}
									className={`shop-price-slider min ${activePriceThumb === 'min' ? 'active' : ''}`}
								/>
								<input
									type="range"
									min={priceBounds.min}
									max={priceBounds.max}
									step={1}
									value={normalizedPriceRange.max}
									onChange={(event) => handlePriceChange('max', event.target.value)}
									onMouseDown={() => handlePriceDragStart('max')}
									onTouchStart={() => handlePriceDragStart('max')}
									onMouseUp={handlePriceDragEnd}
									onTouchEnd={handlePriceDragEnd}
									disabled={isPriceRangeLocked}
									className={`shop-price-slider max ${activePriceThumb === 'max' ? 'active' : ''}`}
								/>
								<div
									className="shop-price-bar"
									style={{
										'--price-min': `${priceBounds.max === priceBounds.min ? 0 : ((normalizedPriceRange.min - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
										'--price-max': `${priceBounds.max === priceBounds.min ? 100 : ((normalizedPriceRange.max - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
									}}
								>
									<span />
								</div>
							</div>
							<div className="shop-price-labels">
								<span>{formatPriceValue(priceBounds.min)}</span>
								<span>{formatPriceValue(priceBounds.max)}+</span>
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
								{shopError ? <p>{shopError}</p> : null}
								{actionMessage ? <p>{actionMessage}</p> : null}
							</div>

							<div className="shop-sort">
								<span className="shop-sort-label">{t('shop.sortBy')}</span>
								<div className="shop-sort-select-wrap">
									<select className="shop-sort-select" value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
										<option value="popularity">{t('shop.popularity')}</option>
										<option value="price-low-high">{t('shop.priceLowHigh')}</option>
										<option value="price-high-low">{t('shop.priceHighLow')}</option>
										<option value="name-az">{t('shop.nameAZ')}</option>
									</select>
									<img src={sortIcon} alt="" aria-hidden="true" />
								</div>
							</div>
						</div>

						<div className="shop-product-grid" data-node-id="2:314">
							{sortedProducts.map((product, index) => (
								<article className="shop-product-card" key={product.id ?? `${product.name}-${index}`} data-node-id={`2:${315 + index * 18}`}>
									<div className="shop-card-image">
										<img src={product.image} alt={product.name} />
										{product.badge ? <span className={`shop-card-badge ${product.badgeTone === 'brown' ? 'brown' : ''}`}>{product.badge}</span> : null}
									</div>

									<div className="shop-card-copy">
										<div className="shop-card-title-row">
											<h4>{product.name}</h4>
											<span className="shop-card-price">{product.priceDisplay || product.price}</span>
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








