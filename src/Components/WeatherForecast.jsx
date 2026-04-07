import { Link } from 'react-router-dom'
import './WeatherForecast.css'
import NavBar from './NavBar'
import Footer from './Footer'
import autoDetectIcon from '../assets/weather/icons/auto-detect.svg'
import cloudIcon from '../assets/weather/icons/cloud.svg'
import dayCloudyIcon from '../assets/weather/icons/day-cloudy.svg'
import dayPartlyIcon from '../assets/weather/icons/day-partly.svg'
import dayRainyIcon from '../assets/weather/icons/day-rainy.svg'
import daySunnyIcon from '../assets/weather/icons/day-sunny.svg'
import guideImage from '../assets/weather/guide-figma.jpg'
import heroImage from '../assets/weather/hero-figma.jpg'
import humidityBadgeIcon from '../assets/weather/icons/humidity-badge.svg'
import locationIcon from '../assets/weather/icons/location.svg'
import rainBadgeIcon from '../assets/weather/icons/rain-badge.svg'

const sideStats = [
	{
		label: 'OPTIMAL',
		value: '64%',
		title: 'Humidity',
		icon: humidityBadgeIcon,
		kind: 'humidity',
	},
	{
		label: 'MODERATE',
		value: '12mm',
		title: 'Expected Rainfall',
		icon: rainBadgeIcon,
		kind: 'rainfall',
	},
]

const weeklyForecast = [
	{ day: 'TODAY', high: '24°', low: '18°', condition: 'SUNNY', tone: 'sunny-chip', icon: daySunnyIcon },
	{ day: 'MON', high: '22°', low: '16°', condition: 'CLOUDY', tone: 'neutral', icon: dayCloudyIcon },
	{ day: 'TUE', high: '19°', low: '15°', condition: 'RAINY', tone: 'rainy', icon: dayRainyIcon },
	{ day: 'WED', high: '21°', low: '16°', condition: 'PARTLY', tone: 'neutral', icon: dayPartlyIcon },
	{ day: 'THU', high: '25°', low: '19°', condition: 'SUNNY', tone: 'neutral', icon: daySunnyIcon },
	{ day: 'FRI', high: '26°', low: '20°', condition: 'SUNNY', tone: 'neutral', icon: daySunnyIcon },
	{ day: 'SAT', high: '24°', low: '18°', condition: 'PARTLY', tone: 'neutral', icon: dayPartlyIcon },
]

function WeatherForecast() {
	return (
		<div className="weather-page">
			<NavBar />

			<main className="weather-shell weather-main">
				<section className="weather-topbar" data-node-id="2:4">
					<div>
						<h2>Weather Forecast</h2>
						<p>Monitoring your local climate conditions in Pokhara</p>
					</div>
					<div className="weather-location-controls">
						<label className="weather-location-input" htmlFor="weather-location">
							<img src={locationIcon} alt="" aria-hidden="true" />
							<input id="weather-location" value="Enter village or district..." readOnly />
						</label>
						<button type="button" className="weather-detect-btn">
							<img src={autoDetectIcon} alt="" aria-hidden="true" />
							<span>Auto-detect</span>
						</button>
					</div>
				</section>

				<section className="weather-hero-grid" data-node-id="2:20">
					<article className="weather-main-card">
						<img src={heroImage} alt="Rice field in Pokhara" className="weather-main-image" />
						<div className="weather-main-overlay" />
						<div className="weather-main-content">
							<span className="weather-live-pill">RIGHT NOW</span>
							<div className="weather-temp-row">
								<strong>22</strong>
								<span>°C</span>
							</div>
							<p>Partly Cloudy • 10:45 AM</p>
						</div>
						<div className="weather-cloud-box">
							<img src={cloudIcon} alt="" aria-hidden="true" />
							<span>SCATTERED CLOUDS</span>
						</div>
					</article>

					<div className="weather-side-stats">
						{sideStats.map((item) => (
							<article className="weather-stat-card" key={item.title}>
								<div className="weather-stat-head">
									<img src={item.icon} alt="" aria-hidden="true" />
									<span className={`weather-stat-tag ${item.kind}`}>{item.label}</span>
								</div>
								<div>
									<strong>{item.value}</strong>
									<p>{item.title}</p>
								</div>
								{item.kind === 'humidity' ? (
									<div className="weather-humidity-bar" aria-hidden="true">
										<span />
									</div>
								) : (
									<div className="weather-rain-bars" aria-hidden="true">
										<span />
										<span />
										<span />
										<span />
										<span />
									</div>
								)}
							</article>
						))}
					</div>
				</section>

				<section className="weather-forecast" data-node-id="2:70">
					<div className="weather-forecast-head">
						<h3>7-Day Forecast</h3>
						<div className="weather-forecast-divider" />
						<button type="button">Download Report</button>
					</div>
					<div className="weather-forecast-cards">
						{weeklyForecast.map((day) => (
							<article className="weather-day-card" key={day.day}>
								<span className="weather-day-name">{day.day}</span>
								<img src={day.icon} alt="" aria-hidden="true" className="weather-day-icon" />
								<div className="weather-day-temps">
									<strong>{day.high}</strong>
									<small>{day.low}</small>
								</div>
								<span className={`weather-day-condition ${day.tone}`}>{day.condition}</span>
							</article>
						))}
					</div>
				</section>

				<section className="weather-guide" data-node-id="2:163">
					<div className="weather-guide-image-wrap">
						<img src={guideImage} alt="Farmer in field" className="weather-guide-image" />
					</div>
					<div className="weather-guide-copy">
						<h3>Smart Agriculture Guide</h3>
						<p>
							Based on current weather, this is an excellent week for planting rice in the
							Pokhara valley. Moderate humidity and scattered showers will reduce the
							need for artificial irrigation.
						</p>
						<div className="weather-guide-tags">
							<span>Planting Season</span>
							<span>Low Irrigation Need</span>
							<span>Favorable Winds</span>
						</div>
					</div>
				</section>
			</main>

			<Footer
				footerClassName="weather-footer"
				innerClassName="weather-shell weather-footer-inner"
				linksClassName="weather-footer-links"
				brand="Krishi Margadarshan"
				copy="© 2024 Krishi Margadarshan. Support: 1800-AGRI-HELP"
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

export default WeatherForecast





