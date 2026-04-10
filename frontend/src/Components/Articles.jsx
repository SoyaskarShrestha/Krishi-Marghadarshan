import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Articles.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import riceFieldsImage from '../assets/articles/rice-fields.jpg'
import soilHealthImage from '../assets/articles/soil-health.jpg'
import pestManagementImage from '../assets/articles/pest-management.jpg'
import marketGuideImage from '../assets/articles/market-guide.jpg'
import searchIcon from '../assets/articles/icons/search.svg'
import filterIcon from '../assets/articles/icons/filter.svg'
import arrowRightIcon from '../assets/articles/icons/arrow-right.svg'
import bookmarkIcon from '../assets/articles/icons/bookmark.svg'
import dropdownIcon from '../assets/articles/icons/dropdown.svg'

const categoryTabs = [
	{ label: 'All', value: '' },
	{ label: 'Crop Guide', value: 'Crop Guide' },
	{ label: 'Pest Control', value: 'Pest Control' },
	{ label: 'Organic Methods', value: 'Organic Methods' },
	{ label: 'Business', value: 'Business' },
]

const cardImages = [riceFieldsImage, soilHealthImage, pestManagementImage, marketGuideImage]

const fallbackCards = [
	{
		featured: true,
		image: riceFieldsImage,
		badge: 'Featured',
		publishedLabel: 'June 2024',
		title: 'Growing Rice in the Terai',
		titleNepali: 'तराईमा धान खेती',
		category: 'Crop Guide',
		description:
			'A comprehensive guide on soil preparation, seed selection, and water management for high-yield rice farming in Nepal\'s southern plains.',
		readTime: '6 min read',
	},
	{
		featured: false,
		image: soilHealthImage,
		category: 'Organic Methods',
		title: 'Natural Compost Secret',
		description: 'Learn how to turn kitchen waste into nutrient-rich soil for your vegetable garden.',
		readTime: '5 min read',
	},
	{
		featured: false,
		image: pestManagementImage,
		category: 'Pest Control',
		title: 'Seasonal Pest Guide',
		description: 'Identifying common monsoon pests and using neem-based solutions for eco-friendly protection.',
		readTime: '8 min read',
	},
	{
		featured: false,
		image: marketGuideImage,
		category: 'Business',
		title: 'Market Price Trends',
		description: 'Understanding the best time to sell your produce in Kathmandu and major local markets.',
		readTime: '12 min read',
	},
]

function Articles() {
	const [cards, setCards] = useState(fallbackCards)
	const [articlesError, setArticlesError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [activeCategory, setActiveCategory] = useState('')
	const [language, setLanguage] = useState('all')

	useEffect(() => {
		let ignore = false

		async function loadArticles() {
			setIsLoading(true)
			try {
				const query = new URLSearchParams()
				if (searchTerm.trim()) {
					query.set('q', searchTerm.trim())
				}
				if (activeCategory) {
					query.set('category', activeCategory)
				}
				if (language) {
					query.set('language', language)
				}

				const suffix = query.toString() ? `?${query.toString()}` : ''
				const payload = await apiRequest(`${API_ENDPOINTS.ARTICLES}${suffix}`)
				if (!Array.isArray(payload) || ignore) {
					return
				}

				const mapped = payload.map((article, index) => ({
					id: article.id,
					featured: Boolean(article.featured),
					image: cardImages[index % cardImages.length],
					badge: article.badge || (article.featured ? 'Featured' : ''),
					publishedLabel: article.published_label || 'Latest',
					title: article.title,
					titleNepali: article.title_nepali || '',
					category: article.category,
					description: article.description,
					readTime: article.read_time || '5 min read',
				}))

				setCards(mapped)
				setArticlesError('')
			} catch (error) {
				if (!ignore) {
					setArticlesError(error.message || 'Showing sample articles because API is not reachable.')
				}
			} finally {
				if (!ignore) {
					setIsLoading(false)
				}
			}
		}

		const timer = window.setTimeout(loadArticles, 300)

		return () => {
			ignore = true
			window.clearTimeout(timer)
		}
	}, [searchTerm, activeCategory, language])

	const featuredCard = useMemo(() => cards.find((card) => card.featured) || cards[0], [cards])
	const miniCards = useMemo(() => cards.filter((card) => card !== featuredCard), [cards, featuredCard])

	return (
		<div className="articles-page" data-node-id="2:812">
			<NavBar />

			<main className="articles-shell articles-main" data-node-id="2:813">
				<section className="articles-hero" data-node-id="2:814">
					<div className="articles-hero-copy" data-node-id="2:815">
						<h2>
							<span>Agriculture</span>
							<span>Learning Hub</span>
						</h2>
						<p>Expert farming techniques and local wisdom shared by the community to help your harvest thrive.</p>
					</div>

					<div className="articles-search-wrap" data-node-id="2:820">
						<div className="articles-search-field">
							<img src={searchIcon} alt="" aria-hidden="true" className="articles-search-icon" />
							<input
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search articles or crops..."
								aria-label="Search articles"
							/>
						</div>
					</div>
				</section>

				<section className="articles-toolbar" data-node-id="2:825">
					<div className="articles-tabs" aria-label="Article categories" data-node-id="2:826">
						{categoryTabs.map((tab) => (
							<button
								type="button"
								className={`articles-tab ${activeCategory === tab.value ? 'active' : ''}`}
								onClick={() => setActiveCategory(tab.value)}
								key={tab.label}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="articles-filter-wrap" data-node-id="2:834">
						<span className="articles-filter-label">Filter By</span>
						<button type="button" className="articles-language-select" aria-hidden="true" tabIndex={-1}>
							<span>Language</span>
							<img src={dropdownIcon} alt="" aria-hidden="true" />
						</button>
						<select
							className="articles-language-dropdown"
							value={language}
							onChange={(event) => setLanguage(event.target.value)}
							aria-label="Filter language"
						>
							<option value="all">All Languages</option>
							<option value="en">English</option>
							<option value="ne">Nepali</option>
						</select>
					</div>
				</section>

				{articlesError ? <p className="articles-shell">{articlesError}</p> : null}
				{isLoading ? <p className="articles-shell">Loading articles...</p> : null}
				{!isLoading && cards.length === 0 ? <p className="articles-shell">No articles found for the selected filters.</p> : null}

				<section className="articles-grid" data-node-id="2:843">
					{featuredCard ? (
						<article className="articles-featured-card" data-node-id="2:844">
							<div className="articles-featured-image-wrap">
								<img src={featuredCard.image} alt={featuredCard.title} />
								<span className="articles-pill">{featuredCard.badge || 'Featured'}</span>
							</div>
							<div className="articles-featured-copy">
								<div className="articles-date-row">
									<img src={filterIcon} alt="" aria-hidden="true" className="articles-date-icon" />
									<span>{featuredCard.publishedLabel}</span>
								</div>
								<h3>
									<span>{featuredCard.title}</span>
									{featuredCard.titleNepali ? <span className="articles-featured-nepali">({featuredCard.titleNepali})</span> : null}
								</h3>
								<p>{featuredCard.description}</p>
								<Link to="/articles" className="articles-read-link">
									<span>Read Full Article</span>
									<img src={arrowRightIcon} alt="" aria-hidden="true" />
								</Link>
							</div>
						</article>
					) : null}

					{miniCards.map((card, index) => (
						<article className={`articles-mini-card ${index === 0 ? 'articles-card-top-right' : ''}`} data-node-id={`2:${867 + index * 16}`} key={card.id || card.title}>
							<img src={card.image} alt={card.title} className="articles-card-image" />
							<div className="articles-card-body">
								<span className="articles-card-category">{card.category}</span>
								<h4>{card.title}</h4>
								<p>{card.description}</p>
								<div className="articles-card-footer">
									<span>{card.readTime}</span>
									<button type="button" className="articles-bookmark-btn" aria-label="Bookmark article">
										<img src={bookmarkIcon} alt="" aria-hidden="true" />
									</button>
								</div>
							</div>
						</article>
					))}
				</section>

				<div className="articles-cta-wrap" data-node-id="2:917">
					<Link to="/articles" className="articles-cta-button">
						Explore More Articles
					</Link>
				</div>
			</main>

			<Footer
				footerClassName="articles-footer"
				innerClassName="articles-shell articles-footer-inner"
				linksClassName="articles-footer-links"
				brand="Krishi Margadarshan"
				copy="© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP"
				footerProps={{ 'data-node-id': '2:919' }}
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

export default Articles





