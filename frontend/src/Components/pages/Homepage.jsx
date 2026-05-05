import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Homepage.css'
import NavBar from '../layout/NavBar'
import Footer from '../layout/Footer'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import featuredImage from '../../assets/homepage/featured.jpg'
import heroImage from '../../assets/homepage/hero.jpg'
import advisoryIcon from '../../assets/homepage/icons/advisory.svg'
import advisoryArrowIcon from '../../assets/homepage/icons/advisory-arrow.svg'
import articlesIcon from '../../assets/homepage/icons/articles.svg'
import articlesArrowIcon from '../../assets/homepage/icons/articles-arrow.svg'
import bookmarkIcon from '../../assets/homepage/icons/bookmark.svg'
import featureArrowIcon from '../../assets/homepage/icons/feature-arrow.svg'
import marketplaceIcon from '../../assets/homepage/icons/marketplace.svg'
import marketplaceArrowIcon from '../../assets/homepage/icons/marketplace-arrow.svg'
import productImage1 from '../../assets/homepage/product-1.jpg'
import productImage2 from '../../assets/homepage/product-2.jpg'
import productImage3 from '../../assets/homepage/product-3.jpg'
import weatherIcon from '../../assets/homepage/icons/weather.svg'
import weatherArrowIcon from '../../assets/homepage/icons/weather-arrow.svg'

const productImages = [productImage1, productImage2, productImage3]

function Homepage() {
	const { t } = useTranslation()
	const { currentUser } = useAuth()
	const isAdmin = Boolean(currentUser?.isAdmin)
	const role = currentUser?.accessRole || (isAdmin ? 'admin' : currentUser?.role || 'guest')
	const quickAccessLinksByRole = useMemo(
		() => ({
			guest: ['/articles', '/shop'],
			buyer: ['/articles', '/shop'],
			farmer: ['/weather', '/articles', '/shop', '/advisory', '/crop-prediction'],
			advisor: ['/articles', '/shop'],
			admin: ['/weather', '/articles', '/shop', '/advisory', '/crop-prediction'],
		}),
		[]
	)
	const heroConfigByRole = {
		guest: { primary: '/articles', primaryLabel: t('home.heroSecondary'), secondary: '/shop', secondaryLabel: t('home.seeAllProducts', { defaultValue: 'Shop' }), panelLink: '/chatbot' },
		buyer: { primary: '/articles', primaryLabel: t('home.heroSecondary'), secondary: '/shop', secondaryLabel: t('home.seeAllProducts', { defaultValue: 'Shop' }), panelLink: '/chatbot' },
		farmer: { primary: '/weather', primaryLabel: t('home.heroPrimary'), secondary: '/advisory', secondaryLabel: t('home.advisoryPanelLink'), panelLink: '/crop-prediction' },
		advisor: { primary: '/articles', primaryLabel: t('home.heroSecondary'), secondary: '/advisor-panel', secondaryLabel: t('navbar.navigation.advisorPanel', { defaultValue: 'Advisor Panel' }), panelLink: '/advisor-panel' },
		admin: { primary: '/admin-dashboard', primaryLabel: 'Admin Dashboard', secondary: '/advisor-panel', secondaryLabel: t('navbar.navigation.advisorPanel', { defaultValue: 'Advisor Panel' }), panelLink: '/admin-dashboard' },
	}
	const roleCopyByRole = {
		guest: {
			badge: 'Guest Dashboard',
			title: 'Browse public farming resources before you sign in.',
			description: 'You can explore articles, shop products, and use the chatbot without logging in.',
			panelBadge: 'Public access',
			panelTitle: 'Get started with articles, shop, and chatbot',
			panelBody: 'Create an account when you are ready to unlock weather, advisory, and crop prediction tools.',
			panelLink: 'Open Chatbot',
		},
		buyer: {
			badge: 'Buyer Dashboard',
			title: 'Shop smarter and stay informed.',
			description: 'Browse agriculture articles, compare products, and use the chatbot for quick guidance.',
			panelBadge: 'Buyer tools',
			panelTitle: 'Your shopping and learning space',
			panelBody: 'Use the marketplace and articles to keep your buying decisions practical and informed.',
			panelLink: 'Open Shop',
		},
		farmer: {
			badge: 'Farmer Dashboard',
			title: 'Manage your farm with weather, advice, and crop prediction.',
			description: 'Check weather forecasts, ask experts, predict crops, and shop for supplies from one place.',
			panelBadge: 'Farmer tools',
			panelTitle: 'Actionable support for your farm',
			panelBody: 'Use advisory, crop prediction, and weather insights together for better field decisions.',
			panelLink: 'Open Advisory',
		},
		advisor: {
			badge: 'Advisor Dashboard',
			title: 'Review questions and respond faster.',
			description: 'Stay in touch with farmers through articles, the chatbot, and your advisory panel.',
			panelBadge: 'Advisor tools',
			panelTitle: 'Questions that need your attention',
			panelBody: 'Jump into the advisor panel to reply to questions and keep the knowledge flow moving.',
			panelLink: 'Open Advisor Panel',
		},
		admin: {
			badge: 'Admin Dashboard',
			title: 'Oversee everything from one control center.',
			description: 'Manage users, advisory flow, shop content, weather access, and the dashboard from a single account.',
			panelBadge: 'System control',
			panelTitle: 'Full access and oversight',
			panelBody: 'Use the admin dashboard to monitor, manage, and coordinate every part of the project.',
			panelLink: 'Open Admin Dashboard',
		},
	}
	const heroConfig = heroConfigByRole[role]
	const roleCopy = roleCopyByRole[role]
	const quickAccess = useMemo(
		() =>
			t('home.quickAccess', { returnObjects: true }).map((item, index) => ({
				...item,
				icon: [weatherIcon, articlesIcon, marketplaceIcon, advisoryIcon][index],
				ctaIcon: [weatherArrowIcon, articlesArrowIcon, marketplaceArrowIcon, advisoryArrowIcon][index],
				href: ['/weather', '/articles', '/shop', '/advisory'][index],
			})).filter((item) => quickAccessLinksByRole[role].includes(item.href)),
		[t, role, quickAccessLinksByRole]
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
	}, [t])

	return (
		<div className="home-page" data-node-id="2:455">
			<NavBar />

			<main className="home-wrap home-main" data-node-id="2:456">
				<section className="home-hero" data-node-id="2:457">
					<img src={heroImage} alt="Terraced fields" className="home-hero-image" />
					<div className="home-hero-overlay" />
					<div className="home-hero-content">
						<span className="home-hero-badge">{roleCopy.badge}</span>
						<div className="home-role-banner">
							<small>{role === 'guest' ? 'Public access' : roleCopy.panelBadge}</small>
							<strong>{roleCopy.title}</strong>
						</div>
						<h2>
							<span>{t('home.heroTitle.0')}</span>
							<span>{t('home.heroTitle.1')}</span>
						</h2>
						<p>{roleCopy.description}</p>
						<div className="home-hero-actions">
							<Link className="home-btn home-btn-primary" to={heroConfig.primary}>
								{heroConfig.primaryLabel}
							</Link>
							<Link className="home-btn home-btn-ghost" to={heroConfig.secondary}>
								{heroConfig.secondaryLabel}
							</Link>
						</div>
					</div>
					<div className="home-hero-panel">
						<div className="home-hero-panel-chip">{roleCopy.panelBadge}</div>
						<h3>{roleCopy.panelTitle}</h3>
						<p>{roleCopy.panelBody}</p>
						<Link to={heroConfig.panelLink}>{roleCopy.panelLink}</Link>
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
