import { NavLink } from 'react-router-dom'
import './WeatherForecast.css'
import advisoryImage from './assets/weather/guide.jpg'
import heroImage from './assets/weather/hero.jpg'

const forecastCards = [
	{ label: 'Today', condition: 'Warm Sun', temperature: '28°C', detail: 'Humidity 63% · Light easterly wind' },
	{ label: 'Tomorrow', condition: 'Passing Rain', temperature: '24°C', detail: '9 mm rainfall expected after 4 PM' },
	{ label: '3-Day', condition: 'Stable Window', temperature: '22-27°C', detail: 'Best irrigation break on Thursday morning' },
]

const fieldMetrics = [
	{ label: 'Rain Chance', value: '72%', note: 'Moderate afternoon showers' },
	{ label: 'Wind', value: '12 km/h', note: 'Safe for spraying before noon' },
	{ label: 'UV Index', value: '6.8', note: 'Cover young seedlings by midday' },
	{ label: 'Soil Moisture', value: '41%', note: 'Hold irrigation for 24 hours' },
]

const weeklyForecast = [
	{ day: 'Tue', high: '28°C', low: '19°C', condition: 'Sunny' },
	{ day: 'Wed', high: '26°C', low: '18°C', condition: 'Cloudy' },
	{ day: 'Thu', high: '24°C', low: '17°C', condition: 'Rain' },
	{ day: 'Fri', high: '25°C', low: '17°C', condition: 'Rain' },
	{ day: 'Sat', high: '27°C', low: '18°C', condition: 'Bright' },
]

function WeatherForecast() {
	return (
		<div className="weather-page">
			<header className="weather-header">
				<div className="weather-shell weather-header-inner">
					<div className="weather-brand-group">
						<h1 className="weather-brand">Krishi Margadarshan</h1>
						<div className="weather-search" role="search" aria-label="Search">
							<span className="weather-search-icon">⌕</span>
							<span>Search weather, crops, advisories...</span>
						</div>
					</div>

					<nav className="weather-nav" aria-label="Main navigation">
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

					<button className="weather-language" type="button">
						<span>⌘</span>
						Language
					</button>
				</div>
			</header>

			<main className="weather-shell weather-main">
				<section className="weather-hero">
					<img src={heroImage} alt="Rice terraces in the hills of Nepal" className="weather-hero-image" />
					<div className="weather-hero-overlay" />
					<div className="weather-hero-copy">
						<span className="weather-kicker">Weather Intelligence</span>
						<h2>
							<span>Plan Field Work</span>
							<span>Before the Rain Arrives</span>
						</h2>
						<p>
							स्थानीय कृषि मौसम पूर्वानुमान, irrigation timing, and crop-safe field advisories
							for the week ahead.
						</p>
						<div className="weather-hero-actions">
							<button type="button" className="weather-btn weather-btn-primary">
								View 7-Day Forecast
							</button>
							<button type="button" className="weather-btn weather-btn-ghost">
								Download Advisory
							</button>
						</div>
					</div>

					<div className="weather-hero-panel">
						<div className="weather-live-chip">
							<span className="weather-live-dot" />
							Live for Kavrepalanchok
						</div>
						<strong>27°C</strong>
						<p>Feels like 29°C with patchy sun and late-evening rain.</p>
						<ul>
							<li>Spraying window: 6:00 AM - 10:30 AM</li>
							<li>Expected rain: 9 mm</li>
							<li>Visibility: Clear across terraces</li>
						</ul>
					</div>
				</section>

				<section className="weather-forecast-grid" aria-label="Forecast overview">
					{forecastCards.map((card) => (
						<article className="weather-forecast-card" key={card.label}>
							<span>{card.label}</span>
							<h3>{card.condition}</h3>
							<strong>{card.temperature}</strong>
							<p>{card.detail}</p>
						</article>
					))}
				</section>

				<section className="weather-content-grid">
					<article className="weather-panel weather-advisory">
						<div className="weather-panel-head">
							<div>
								<span className="weather-section-label">Field Advisory</span>
								<h3>Best planting and spraying window</h3>
							</div>
							<a href="/">View all alerts</a>
						</div>
						<div className="weather-advisory-body">
							<img src={advisoryImage} alt="Farmer standing in a vegetable field" />
							<div>
								<p>
									Clear conditions will hold through the morning. Complete foliar spray,
									transplanting, and open-field weeding before noon to avoid moisture loss.
								</p>
								<div className="weather-advisory-list">
									<div>
										<strong>06:00 - 10:30</strong>
										<span>Safe for spraying and seedbed preparation</span>
									</div>
									<div>
										<strong>13:00 - 17:00</strong>
										<span>Cloud build-up with moderate rain probability</span>
									</div>
									<div>
										<strong>Night</strong>
										<span>Hold irrigation, soil already retains enough moisture</span>
									</div>
								</div>
							</div>
						</div>
					</article>

					<article className="weather-panel weather-weekly">
						<div className="weather-panel-head">
							<div>
								<span className="weather-section-label">7-Day Outlook</span>
								<h3>Daily field conditions</h3>
							</div>
						</div>
						<div className="weather-weekly-list">
							{weeklyForecast.map((day) => (
								<div className="weather-weekly-row" key={day.day}>
									<strong>{day.day}</strong>
									<span>{day.condition}</span>
									<span>{day.high}</span>
									<span>{day.low}</span>
								</div>
							))}
						</div>
					</article>
				</section>

				<section className="weather-metrics">
					<div className="weather-metrics-head">
						<div>
							<span className="weather-section-label">Agro Metrics</span>
							<h3>Decision-ready weather data</h3>
						</div>
						<p>Short operational signals for farmers, cooperatives, and extension teams.</p>
					</div>

					<div className="weather-metric-grid">
						{fieldMetrics.map((metric) => (
							<article className="weather-metric-card" key={metric.label}>
								<span>{metric.label}</span>
								<strong>{metric.value}</strong>
								<p>{metric.note}</p>
							</article>
						))}
					</div>
				</section>
			</main>
		</div>
	)
}

export default WeatherForecast
