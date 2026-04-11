import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Homepage.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useTranslation } from 'react-i18next'
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

const productImages = [productImage1, productImage2, productImage3]

function Homepage() {
	const { t } = useTranslation()
	const quickAccess = useMemo(
		() =>
			t('home.quickAccess', { returnObjects: true }).map((item, index) => ({
				...item,
				icon: [weatherIcon, articlesIcon, marketplaceIcon, advisoryIcon][index],
				ctaIcon: [weatherArrowIcon, articlesArrowIcon, marketplaceArrowIcon, advisoryArrowIcon][index],
				href: ['/weather', '/articles', '/shop', '/advisory'][index],
			})),
		[t]
	)
	const fallbackProducts = useMemo(
		() =>
			t('home.fallbackProducts', { returnObjects: true }).map((product, index) => ({
				...product,
				image: productImages[index % productImages.length],
			})),
		[t]
	)
	const fallbackFeaturedArticle = useMemo(
		() => ({
			title: t('home.featureTitle.0'),
			description: t('home.featureBody'),
		}),
		[t]
	)
	const [products, setProducts] = useState(fallbackProducts)
	const [featuredArticle, setFeaturedArticle] = useState(fallbackFeaturedArticle)
	const [isUsingFallbackProducts, setIsUsingFallbackProducts] = useState(true)
	const [isUsingFallbackArticle, setIsUsingFallbackArticle] = useState(true)

	useEffect(() => {
		if (isUsingFallbackProducts) {
			setProducts(fallbackProducts)
		}
	}, [fallbackProducts, isUsingFallbackProducts])

	useEffect(() => {
		if (isUsingFallbackArticle) {
			setFeaturedArticle(fallbackFeaturedArticle)
		}
	}, [fallbackFeaturedArticle, isUsingFallbackArticle])

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
										tag: product.badge || product.category || t('home.defaultTag'),
						}))
					)
					setIsUsingFallbackProducts(false)
				}

				if (!ignore && Array.isArray(articles) && articles.length > 0) {
					const pick = articles.find((article) => article.featured) || articles[0]
					setFeaturedArticle({
						title: pick.title,
						description: pick.description,
					})
					setIsUsingFallbackArticle(false)
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
			<NavBar showSearch searchPlaceholder={t('home.headerSearch')} />

			<main className="home-wrap home-main" data-node-id="2:456">
				<section className="home-hero" data-node-id="2:457">
					<img src={heroImage} alt="Terraced fields" className="home-hero-image" />
					<div className="home-hero-overlay" />
					<div className="home-hero-content">
						<span className="home-hero-badge">{t('home.heroBadge')}</span>
						<h2>
							<span>{t('home.heroTitle.0')}</span>
							<span>{t('home.heroTitle.1')}</span>
						</h2>
						<p>{t('home.heroBody')}</p>
						<div className="home-hero-actions">
							<Link className="home-btn home-btn-primary" to="/weather">
								{t('home.heroPrimary')}
							</Link>
							<Link className="home-btn home-btn-ghost" to="/articles">
								{t('home.heroSecondary')}
							</Link>
						</div>
					</div>
					<div className="home-hero-panel">
						<div className="home-hero-panel-chip">{t('home.advisoryPanelBadge')}</div>
						<h3>{t('home.advisoryPanelTitle')}</h3>
						<p>{t('home.advisoryPanelBody')}</p>
						<Link to="/advisory">{t('home.advisoryPanelLink')}</Link>
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
						<span className="home-pill">{t('home.featurePill')}</span>
						<h3>
							<span>{featuredArticle.title}</span>
						</h3>
						<p>{featuredArticle.description}</p>
						<Link to="/articles" className="home-feature-link">
							<span className="home-circle-arrow">
								<img src={featureArrowIcon} alt="" aria-hidden="true" className="home-feature-arrow-icon" />
							</span>
							{t('home.featureLink')}
						</Link>
					</article>

					<article className="home-feature-card" data-node-id="2:533">
						<img src={featuredImage} alt={t('home.featureCardImageAlt')} />
						<div className="home-feature-chip">
							<div className="home-feature-chip-row">
								<div className="home-feature-chip-copy">
									<small className="home-feature-chip-label">{t('home.featureCardLabel')}</small>
									<strong className="home-feature-chip-title">{t('home.featureCardTitle')}</strong>
									
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
							<h3>{t('home.marketTitle')}</h3>
							<p>{t('home.marketBody')}</p>
						</div>
						<Link to="/shop">{t('home.seeAllProducts')}</Link>
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
									<Link to="/shop" className="home-product-button">{t('home.productCta')}</Link>
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
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
				wrapBrandCopy
				footerProps={{ 'data-node-id': '2:593' }}
				innerProps={{ 'data-node-id': '2:594' }}
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

export default Homepage
