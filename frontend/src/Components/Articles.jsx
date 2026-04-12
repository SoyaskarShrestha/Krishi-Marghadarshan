import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Articles.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import riceFieldsImage from '../assets/articles/rice-fields.jpg'
import soilHealthImage from '../assets/articles/soil-health.jpg'
import pestManagementImage from '../assets/articles/pest-management.jpg'
import marketGuideImage from '../assets/articles/market-guide.jpg'
import searchIcon from '../assets/articles/icons/search.svg'
import filterIcon from '../assets/articles/icons/filter.svg'
import arrowRightIcon from '../assets/articles/icons/arrow-right.svg'
import bookmarkIcon from '../assets/articles/icons/bookmark.svg'
import dropdownIcon from '../assets/articles/icons/dropdown.svg'

const cardImages = [riceFieldsImage, soilHealthImage, pestManagementImage, marketGuideImage]
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '')

function resolveArticleImage(photo, index) {
	if (typeof photo === 'string' && photo.trim().length > 0) {
		if (photo.startsWith('http://') || photo.startsWith('https://')) {
			return photo
		}

		if (photo.startsWith('/')) {
			return `${apiOrigin}${photo}`
		}

		return `${apiOrigin}/${photo}`
	}

	return cardImages[index % cardImages.length]
}

function normalizeArticleId(value) {
	if (value === null || value === undefined || value === '') {
		return ''
	}
	return String(value)
}

function Articles() {
	const { t } = useTranslation()
	const { isAuthenticated, isAuthReady } = useAuth()
	const categoryTabs = t('articles.categories', { returnObjects: true })
	const fallbackCards = useMemo(
		() =>
			t('articles.featured', { returnObjects: true }).map((article, index) => ({
				...article,
				image: cardImages[index % cardImages.length],
				badge: article.badge || (article.featured ? t('articles.featuredBadge') : ''),
			})),
		[t]
	)
	const [cards, setCards] = useState(fallbackCards)
	const [isUsingFallbackCards, setIsUsingFallbackCards] = useState(true)
	const [articlesError, setArticlesError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [activeCategory, setActiveCategory] = useState('')
	const [language, setLanguage] = useState('all')
	const [savedArticleIds, setSavedArticleIds] = useState(new Set())
	const [saveFeedback, setSaveFeedback] = useState('')
	const isSavedArticle = (articleId) => savedArticleIds.has(normalizeArticleId(articleId))

	useEffect(() => {
		if (isUsingFallbackCards) {
			setCards(fallbackCards)
		}
	}, [fallbackCards, isUsingFallbackCards])

	useEffect(() => {
		if (!isAuthReady) {
			return
		}

		if (!isAuthenticated) {
			setSavedArticleIds(new Set())
			return
		}

		let ignore = false

		async function loadSavedArticles() {
			try {
				const payload = await apiRequest(API_ENDPOINTS.ARTICLES_SAVED)
				if (!Array.isArray(payload) || ignore) {
					return
				}

				setSavedArticleIds(
					new Set(
						payload
							.map((item) => normalizeArticleId(item.article?.id))
							.filter(Boolean)
					)
				)
			} catch {
				if (!ignore) {
					setSavedArticleIds(new Set())
				}
			}
		}

		loadSavedArticles()

		return () => {
			ignore = true
		}
	}, [isAuthenticated, isAuthReady])

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
					image: resolveArticleImage(article.photo, index),
					badge: article.badge || (article.featured ? t('articles.featuredBadge') : ''),
					publishedLabel: article.published_label || t('articles.latestLabel'),
					title: article.title,
					titleNepali: article.title_nepali || '',
					category: article.category,
					description: article.description,
									readTime: article.read_time || t('articles.defaultReadTime'),
				}))

				setCards(mapped)
				setIsUsingFallbackCards(false)
				setArticlesError('')
			} catch (error) {
				if (!ignore) {
					setArticlesError(error.message || t('articles.loading'))
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
	}, [searchTerm, activeCategory, language, t])

	const toggleSaved = async (article) => {
		const normalizedArticleId = normalizeArticleId(article?.id)
		if (!normalizedArticleId) {
			setSaveFeedback('Only published backend articles can be saved.')
			return
		}

		if (!isAuthenticated) {
			setSaveFeedback('Please login to save articles.')
			return
		}

		const articleId = article.id
		const alreadySaved = isSavedArticle(articleId)

		try {
			if (alreadySaved) {
				await apiRequest(`${API_ENDPOINTS.ARTICLES_SAVED}${articleId}/`, { method: 'DELETE' })
				setSavedArticleIds((current) => {
					const next = new Set(current)
					next.delete(normalizedArticleId)
					return next
				})
				setSaveFeedback('Article removed from saved list.')
			} else {
				await apiRequest(API_ENDPOINTS.ARTICLES_SAVED, {
					method: 'POST',
					body: JSON.stringify({ article_id: articleId }),
				})
				setSavedArticleIds((current) => new Set(current).add(normalizedArticleId))
				setSaveFeedback('Article saved successfully.')
			}
		} catch (error) {
			setSaveFeedback(error.message || 'Unable to update saved articles.')
		}
	}

	const featuredCard = useMemo(() => cards.find((card) => card.featured) || cards[0], [cards])
	const miniCards = useMemo(() => cards.filter((card) => card !== featuredCard), [cards, featuredCard])
	const getSaveLabel = (isSaved) => (isSaved ? 'Saved' : 'Save')

	return (
		<div className="articles-page" data-node-id="2:812">
			<NavBar />

			<main className="articles-shell articles-main" data-node-id="2:813">
				<section className="articles-hero" data-node-id="2:814">
					<div className="articles-hero-copy" data-node-id="2:815">
						<h2>
							<span>{t('articles.heroTitle.0')}</span>
							<span>{t('articles.heroTitle.1')}</span>
						</h2>
						<p>{t('articles.heroBody')}</p>
					</div>

					<div className="articles-search-wrap" data-node-id="2:820">
						<div className="articles-search-field">
							<img src={searchIcon} alt="" aria-hidden="true" className="articles-search-icon" />
							<input
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder={t('articles.searchPlaceholder')}
								aria-label={t('articles.searchAria')}
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
						<span className="articles-filter-label">{t('articles.filterLabel')}</span>
						<button type="button" className="articles-language-select" aria-hidden="true" tabIndex={-1}>
							<span>{t('articles.languageLabel')}</span>
							<img src={dropdownIcon} alt="" aria-hidden="true" />
						</button>
						<select
							className="articles-language-dropdown"
							value={language}
							onChange={(event) => setLanguage(event.target.value)}
							aria-label={t('articles.languageLabel')}
						>
							<option value="all">{t('articles.allLanguages')}</option>
							<option value="en">{t('articles.english')}</option>
							<option value="ne">{t('articles.nepali')}</option>
						</select>
					</div>
				</section>

				{articlesError ? <p className="articles-shell">{articlesError}</p> : null}
				{saveFeedback ? <p className="articles-shell articles-save-feedback">{saveFeedback}</p> : null}
				{isLoading ? <p className="articles-shell">{t('articles.loading')}</p> : null}
				{!isLoading && cards.length === 0 ? <p className="articles-shell">{t('articles.emptyState')}</p> : null}

				<section className="articles-grid" data-node-id="2:843">
					{featuredCard ? (
						<article className="articles-featured-card" data-node-id="2:844">
							<div className="articles-featured-image-wrap">
								<img src={featuredCard.image} alt={featuredCard.title} />
								<span className="articles-pill">{featuredCard.badge || t('articles.featuredBadge')}</span>
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
								<div className="articles-featured-actions">
									<Link to="/articles" className="articles-read-link">
										<span>{t('articles.readFullArticle')}</span>
										<img src={arrowRightIcon} alt="" aria-hidden="true" />
									</Link>
									<button
										type="button"
										className={`articles-bookmark-btn articles-bookmark-pill ${isSavedArticle(featuredCard.id) ? 'saved' : ''}`}
										aria-label={isSavedArticle(featuredCard.id) ? 'Remove from saved' : t('articles.bookmarkAria')}
										onClick={() => toggleSaved(featuredCard)}
									>
										<img src={bookmarkIcon} alt="" aria-hidden="true" />
										<span>{getSaveLabel(isSavedArticle(featuredCard.id))}</span>
									</button>
								</div>
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
										<button
											type="button"
											className={`articles-bookmark-btn articles-bookmark-pill ${isSavedArticle(card.id) ? 'saved' : ''}`}
											aria-label={isSavedArticle(card.id) ? 'Remove from saved' : t('articles.bookmarkAria')}
											onClick={() => toggleSaved(card)}
										>
											<img src={bookmarkIcon} alt="" aria-hidden="true" />
											<span>{getSaveLabel(isSavedArticle(card.id))}</span>
									</button>
								</div>
							</div>
						</article>
					))}
				</section>

				<div className="articles-cta-wrap" data-node-id="2:917">
					<Link to="/articles" className="articles-cta-button">
							{t('articles.cta')}
					</Link>
				</div>
			</main>

			<Footer
				footerClassName="articles-footer"
				innerClassName="articles-shell articles-footer-inner"
				linksClassName="articles-footer-links"
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
				footerProps={{ 'data-node-id': '2:919' }}
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

export default Articles





