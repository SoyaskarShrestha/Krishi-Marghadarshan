import { NavLink } from 'react-router-dom'
import './Articles.css'
import featuredImage from './assets/homepage/featured.jpg'
import heroImage from './assets/homepage/hero.jpg'
import articleIcon from './assets/homepage/icons/articles.png'
import productImage1 from './assets/homepage/product-1.jpg'
import productImage2 from './assets/homepage/product-2.jpg'
import productImage3 from './assets/homepage/product-3.jpg'

const categories = [
	{ title: 'Crop Planning', articles: '18 Guides', tone: 'earth' },
	{ title: 'Pest Control', articles: '12 Guides', tone: 'sage' },
	{ title: 'Soil Health', articles: '09 Guides', tone: 'cream' },
]

const articleCards = [
	{
		title: 'Rice cultivation timing for mid-hill districts',
		excerpt:
			'Planting windows, seedbed preparation, and irrigation checkpoints for terraces and rain-fed fields.',
		image: featuredImage,
		tag: 'Seasonal',
		readTime: '6 min read',
	},
	{
		title: 'How to identify early fungal stress in vegetables',
		excerpt:
			'Practical field signs, moisture triggers, and low-cost intervention steps for small farms.',
		image: productImage2,
		tag: 'Plant Health',
		readTime: '4 min read',
	},
	{
		title: 'Organic soil recovery after heavy monsoon runoff',
		excerpt:
			'Simple amendments and mulching strategies that restore structure without expensive inputs.',
		image: productImage3,
		tag: 'Soil',
		readTime: '5 min read',
	},
]

const trendingArticles = [
	'Choosing resilient seed varieties before the next rainfall cycle',
	'Three low-cost irrigation habits that reduce water loss',
	'What extension workers recommend for nursery preparation this month',
	'When to pause fertilizer application after evening showers',
]

function Articles() {
	return (
		<div className="articles-page">
			<header className="articles-header">
				<div className="articles-shell articles-header-inner">
					<div className="articles-brand-group">
						<h1 className="articles-brand">Krishi Margadarshan</h1>
						<div className="articles-search" role="search" aria-label="Search">
							<span className="articles-search-icon">Search</span>
							<span>Find articles, guides, and field notes...</span>
						</div>
					</div>

					<nav className="articles-nav" aria-label="Main navigation">
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

					<button className="articles-language" type="button">
						<span>GL</span>
						Language
					</button>
				</div>
			</header>

			<main className="articles-shell articles-main">
				<section className="articles-hero">
					<div className="articles-hero-copy">
						<div className="articles-badge">
							<img src={articleIcon} alt="" aria-hidden="true" />
							<span>Knowledge Hub</span>
						</div>
						<h2>
							<span>Read practical farming</span>
							<span>guides for every season</span>
						</h2>
						<p>
							Crop calendars, pest control notes, soil advice, and field-tested methods
							organized for daily agricultural decisions.
						</p>
						<div className="articles-hero-actions">
							<button type="button" className="articles-btn articles-btn-primary">
								Browse Latest Articles
							</button>
							<button type="button" className="articles-btn articles-btn-secondary">
								Save Reading List
							</button>
						</div>
					</div>

					<div className="articles-hero-visual">
						<img src={heroImage} alt="Terraced fields at sunrise" />
						<div className="articles-floating-card">
							<span>Editor's Pick</span>
							<strong>Monsoon-ready field planning checklist</strong>
							<p>Short actions to finish before the next wet spell begins.</p>
						</div>
					</div>
				</section>

				<section className="articles-category-row" aria-label="Article categories">
					{categories.map((category) => (
						<article className={`articles-category-card ${category.tone}`} key={category.title}>
							<span>{category.articles}</span>
							<h3>{category.title}</h3>
							<a href="/">Open section</a>
						</article>
					))}
				</section>

				<section className="articles-feature-grid">
					<article className="articles-feature-story">
						<div className="articles-section-head">
							<div>
								<span className="articles-section-label">Featured Story</span>
								<h3>Mastering rice cultivation in Nepal</h3>
							</div>
							<a href="/">View article</a>
						</div>

						<div className="articles-feature-body">
							<img src={featuredImage} alt="Farmer holding a rice crop" />
							<div className="articles-feature-copy">
								<p>
									A practical walkthrough covering land preparation, seed selection,
									transplant timing, spacing, and water management for better yields.
								</p>
								<ul>
									<li>Seed treatment and nursery preparation</li>
									<li>Transplant spacing for stronger root development</li>
									<li>How to react when rainfall shifts mid-season</li>
								</ul>
							</div>
						</div>
					</article>

					<aside className="articles-trending">
						<div className="articles-section-head">
							<div>
								<span className="articles-section-label">Trending</span>
								<h3>Most read this week</h3>
							</div>
						</div>
						<div className="articles-trending-list">
							{trendingArticles.map((article, index) => (
								<div className="articles-trending-item" key={article}>
									<strong>0{index + 1}</strong>
									<p>{article}</p>
								</div>
							))}
						</div>
					</aside>
				</section>

				<section className="articles-library">
					<div className="articles-section-head">
						<div>
							<span className="articles-section-label">Latest Library</span>
							<h3>Fresh guides and field notes</h3>
						</div>
						<a href="/">See all articles</a>
					</div>

					<div className="articles-grid">
						{articleCards.map((article) => (
							<article className="articles-card" key={article.title}>
								<img src={article.image} alt={article.title} />
								<div className="articles-card-copy">
									<div className="articles-card-meta">
										<span>{article.tag}</span>
										<span>{article.readTime}</span>
									</div>
									<h4>{article.title}</h4>
									<p>{article.excerpt}</p>
									<a href="/">Read article</a>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="articles-newsletter">
					<div>
						<span className="articles-section-label dark">Weekly Digest</span>
						<h3>Receive new agricultural articles and advisories</h3>
						<p>
							Get concise reading recommendations tailored for planting, irrigation, soil,
							and crop protection decisions.
						</p>
					</div>
					<form className="articles-newsletter-form">
						<input type="email" placeholder="Enter your email" aria-label="Email address" />
						<button type="submit">Subscribe</button>
					</form>
				</section>
			</main>
		</div>
	)
}

export default Articles
