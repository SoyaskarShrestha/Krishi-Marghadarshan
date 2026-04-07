import { Link } from 'react-router-dom'
import './Articles.css'
import NavBar from './NavBar'
import riceFieldsImage from '../assets/articles/rice-fields.jpg'
import soilHealthImage from '../assets/articles/soil-health.jpg'
import pestManagementImage from '../assets/articles/pest-management.jpg'
import marketGuideImage from '../assets/articles/market-guide.jpg'
import searchIcon from '../assets/articles/icons/search.svg'
import filterIcon from '../assets/articles/icons/filter.svg'
import arrowRightIcon from '../assets/articles/icons/arrow-right.svg'
import bookmarkIcon from '../assets/articles/icons/bookmark.svg'
import dropdownIcon from '../assets/articles/icons/dropdown.svg'

const tabs = [
	{ label: 'Crop Guide (बाली गाइड)', active: true },
	{ label: 'Pest Control (कीरा नियन्त्रण)', active: false },
	{ label: 'Seasonal Farming (मौसमी खेती)', active: false },
]

const cards = [
	{
		type: 'featured',
		image: riceFieldsImage,
		badge: 'Featured',
		date: 'June 2024',
		title: ['Growing Rice in the', 'Terai', '(तराईमा धान खेती)'],
		description:
			'A comprehensive guide on soil preparation, seed selection, and water management for high-yield rice farming in Nepal\'s southern plains.',
		action: 'Read Full Article',
	},
	{
		type: 'stacked',
		image: soilHealthImage,
		category: 'Organic Methods',
		title: 'Natural Compost Secret',
		description: 'Learn how to turn kitchen waste into nutrient-rich soil for your vegetable garden.',
		readTime: '5 min read',
	},
	{
		type: 'stacked',
		image: pestManagementImage,
		category: 'Pest Control',
		title: 'Seasonal Pest Guide',
		description: 'Identifying common monsoon pests and using neem-based solutions for eco-friendly protection.',
		readTime: '8 min read',
	},
	{
		type: 'stacked',
		image: marketGuideImage,
		category: 'Business',
		title: 'Market Price Trends',
		description: 'Understanding the best time to sell your produce in Kathmandu and major local markets.',
		readTime: '12 min read',
	},
]

function Articles() {
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
							<span>Search articles or crops...</span>
						</div>
					</div>
				</section>

				<section className="articles-toolbar" data-node-id="2:825">
					<div className="articles-tabs" aria-label="Article categories" data-node-id="2:826">
						{tabs.map((tab) => (
							<button
								type="button"
								className={`articles-tab ${tab.active ? 'active' : ''}`}
								key={tab.label}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="articles-filter-wrap" data-node-id="2:834">
						<span className="articles-filter-label">Filter By</span>
						<button type="button" className="articles-language-select">
							<span>All Languages</span>
							<img src={dropdownIcon} alt="" aria-hidden="true" />
						</button>
					</div>
				</section>

				<section className="articles-grid" data-node-id="2:843">
					<article className="articles-featured-card" data-node-id="2:844">
						<div className="articles-featured-image-wrap">
							<img src={cards[0].image} alt="Rice field in the Terai" />
							<span className="articles-pill">{cards[0].badge}</span>
						</div>
						<div className="articles-featured-copy">
							<div className="articles-date-row">
								<img src={filterIcon} alt="" aria-hidden="true" className="articles-date-icon" />
								<span>{cards[0].date}</span>
							</div>
							<h3>
								<span>{cards[0].title[0]}</span>
								<span>{cards[0].title[1]}</span>
								<span className="articles-featured-nepali">{cards[0].title[2]}</span>
							</h3>
							<p>{cards[0].description}</p>
							<Link to="/articles" className="articles-read-link">
								<span>{cards[0].action}</span>
								<img src={arrowRightIcon} alt="" aria-hidden="true" />
							</Link>
						</div>
					</article>

					<article className="articles-mini-card articles-card-top-right" data-node-id="2:867">
						<img src={cards[1].image} alt={cards[1].title} className="articles-card-image" />
						<div className="articles-card-body">
							<span className="articles-card-category">{cards[1].category}</span>
							<h4>{cards[1].title}</h4>
							<p>{cards[1].description}</p>
							<div className="articles-card-footer">
								<span>{cards[1].readTime}</span>
								<button type="button" className="articles-bookmark-btn" aria-label="Bookmark article">
									<img src={bookmarkIcon} alt="" aria-hidden="true" />
								</button>
							</div>
						</div>
					</article>

					<article className="articles-mini-card" data-node-id="2:883">
						<img src={cards[2].image} alt={cards[2].title} className="articles-card-image" />
						<div className="articles-card-body">
							<span className="articles-card-category">{cards[2].category}</span>
							<h4>{cards[2].title}</h4>
							<p>{cards[2].description}</p>
							<div className="articles-card-footer">
								<span>{cards[2].readTime}</span>
								<button type="button" className="articles-bookmark-btn" aria-label="Bookmark article">
									<img src={bookmarkIcon} alt="" aria-hidden="true" />
								</button>
							</div>
						</div>
					</article>

					<article className="articles-mini-card" data-node-id="2:899">
						<img src={cards[3].image} alt={cards[3].title} className="articles-card-image" />
						<div className="articles-card-body">
							<span className="articles-card-category">{cards[3].category}</span>
							<h4>{cards[3].title}</h4>
							<p>{cards[3].description}</p>
							<div className="articles-card-footer">
								<span>{cards[3].readTime}</span>
								<button type="button" className="articles-bookmark-btn" aria-label="Bookmark article">
									<img src={bookmarkIcon} alt="" aria-hidden="true" />
								</button>
							</div>
						</div>
					</article>
				</section>

				<div className="articles-cta-wrap" data-node-id="2:917">
					<Link to="/articles" className="articles-cta-button">
						Explore More Articles
					</Link>
				</div>
			</main>

			<footer className="articles-footer" data-node-id="2:919">
				<div className="articles-shell articles-footer-inner">
					<strong>Krishi Margadarshan</strong>
					<div className="articles-footer-links">
						<Link to="/advisory">Support Centers</Link>
						<Link to="/articles">FAQ</Link>
						<Link to="/advisory">Privacy</Link>
						<Link to="/advisory">Contact</Link>
					</div>
					<p>© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP</p>
				</div>
			</footer>
		</div>
	)
}

export default Articles





