import { useEffect, useMemo, useState } from 'react'
import './WeatherForecast.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useTranslation } from 'react-i18next'
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

const weatherIcons = {
	SUNNY: daySunnyIcon,
	CLOUDY: dayCloudyIcon,
	RAINY: dayRainyIcon,
	PARTLY: dayPartlyIcon,
}

const statIconByKind = {
	humidity: humidityBadgeIcon,
	rainfall: rainBadgeIcon,
}

function WeatherForecast() {
	const { t } = useTranslation()
	const [location, setLocation] = useState('Pokhara')
	const sideStats = useMemo(
		() => [
			{
						label: t('weather.optimal'),
				value: '64%',
				title: t('weather.humidity'),
				icon: humidityBadgeIcon,
				kind: 'humidity',
			},
			{
						label: t('weather.moderate'),
				value: '12mm',
				title: t('weather.expectedRainfall'),
				icon: rainBadgeIcon,
				kind: 'rainfall',
			},
		],
		[t]
	)
	const weeklyForecast = useMemo(
		() => [
			{ day: t('weather.today'), high: '24°', low: '18°', condition: t('weather.conditionSunny'), tone: 'sunny-chip', icon: daySunnyIcon },
			{ day: t('weather.mon'), high: '22°', low: '16°', condition: t('weather.conditionCloudy'), tone: 'neutral', icon: dayCloudyIcon },
			{ day: t('weather.tue'), high: '19°', low: '15°', condition: t('weather.conditionRainy'), tone: 'rainy', icon: dayRainyIcon },
			{ day: t('weather.wed'), high: '21°', low: '16°', condition: t('weather.conditionPartly'), tone: 'neutral', icon: dayPartlyIcon },
			{ day: t('weather.thu'), high: '25°', low: '19°', condition: t('weather.conditionSunny'), tone: 'neutral', icon: daySunnyIcon },
			{ day: t('weather.fri'), high: '26°', low: '20°', condition: t('weather.conditionSunny'), tone: 'neutral', icon: daySunnyIcon },
			{ day: t('weather.sat'), high: '24°', low: '18°', condition: t('weather.conditionPartly'), tone: 'neutral', icon: dayPartlyIcon },
		],
		[t]
	)
	const fallbackWeatherData = useMemo(
		() => ({
			current: {
				temperature_c: 22,
				summary: t('weather.weatherSummary'),
				timestamp: t('weather.weatherTimestamp'),
				sky_label: t('weather.weatherSky'),
			},
			stats: sideStats,
			weekly: weeklyForecast,
			guide: {
				title: t('weather.weatherGuideTitle'),
				body: t('weather.weatherGuideBody'),
				tags: t('weather.weatherGuideTags', { returnObjects: true }),
			},
		}),
		[t, sideStats, weeklyForecast]
	)
	const [weatherData, setWeatherData] = useState(fallbackWeatherData)
	const [isUsingFallbackWeather, setIsUsingFallbackWeather] = useState(true)
	const [weatherError, setWeatherError] = useState('')

	useEffect(() => {
		if (isUsingFallbackWeather) {
			setWeatherData(fallbackWeatherData)
		}
	}, [fallbackWeatherData, isUsingFallbackWeather])

	const requestForecast = async (targetLocation) => {
		try {
			const payload = await apiRequest(`${API_ENDPOINTS.WEATHER_FORECAST}?location=${encodeURIComponent(targetLocation)}`)
			setWeatherData((previous) => ({
				...previous,
				...payload,
				stats: (payload.stats || []).map((item) => ({
					...item,
					icon: statIconByKind[item.kind] || humidityBadgeIcon,
				})),
			}))
			setIsUsingFallbackWeather(false)
			setWeatherError('')
		} catch (error) {
			setWeatherError(error.message || t('weather.fallbackError'))
		}
	}

	useEffect(() => {
		let ignore = false
		const timer = window.setTimeout(async () => {
			try {
				const payload = await apiRequest(`${API_ENDPOINTS.WEATHER_FORECAST}?location=${encodeURIComponent(location)}`)
				if (!ignore) {
					setWeatherData((previous) => ({
						...previous,
						...payload,
						stats: (payload.stats || []).map((item) => ({
							...item,
							icon: statIconByKind[item.kind] || humidityBadgeIcon,
						})),
					}))
					setIsUsingFallbackWeather(false)
					setWeatherError('')
				}
			} catch (error) {
				if (!ignore) {
					setWeatherError(error.message || t('weather.fallbackError'))
				}
			}
		}, 500)

		return () => {
			ignore = true
			window.clearTimeout(timer)
		}
	}, [location, t])

	const weeklyWithIcons = useMemo(
		() => (weatherData.weekly || weeklyForecast).map((item) => ({ ...item, icon: weatherIcons[item.condition] || dayPartlyIcon })),
		[weatherData.weekly]
	)

	return (
		<div className="weather-page">
			<NavBar />

			<main className="weather-shell weather-main">
				{weatherError ? <p>{weatherError}</p> : null}
				<section className="weather-topbar" data-node-id="2:4">
					<div>
						<h2>{t('weather.title')}</h2>
						<p>{t('weather.description', { location })}</p>
					</div>
					<div className="weather-location-controls">
						<label className="weather-location-input" htmlFor="weather-location">
							<img src={locationIcon} alt="" aria-hidden="true" />
							<input
								id="weather-location"
								value={location}
								onChange={(event) => setLocation(event.target.value)}
								placeholder={t('weather.locationPlaceholder')}
							/>
						</label>
						<button type="button" className="weather-detect-btn" onClick={() => requestForecast(location)}>
							<img src={autoDetectIcon} alt="" aria-hidden="true" />
							<span>{t('weather.refresh')}</span>
						</button>
					</div>
				</section>

				<section className="weather-hero-grid" data-node-id="2:20">
					<article className="weather-main-card">
						<img src={heroImage} alt="Rice field in Pokhara" className="weather-main-image" />
						<div className="weather-main-overlay" />
						<div className="weather-main-content">
							<span className="weather-live-pill">{t('weather.rightNow')}</span>
							<div className="weather-temp-row">
								<strong>{weatherData.current.temperature_c}</strong>
								<span>°C</span>
							</div>
							<p>{weatherData.current.summary} • {weatherData.current.timestamp}</p>
						</div>
						<div className="weather-cloud-box">
							<img src={cloudIcon} alt="" aria-hidden="true" />
							<span>{weatherData.current.sky_label}</span>
						</div>
					</article>

					<div className="weather-side-stats">
						{(weatherData.stats || sideStats).map((item) => (
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
							<h3>{t('weather.forecast7Day')}</h3>
						<div className="weather-forecast-divider" />
							<button type="button">{t('weather.downloadReport')}</button>
					</div>
					<div className="weather-forecast-cards">
						{weeklyWithIcons.map((day) => (
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
						<h3>{weatherData.guide?.title || t('weather.weatherGuideTitle')}</h3>
						<p>{weatherData.guide?.body}</p>
						<div className="weather-guide-tags">
							{(weatherData.guide?.tags || []).map((tag) => (
								<span key={tag}>{tag}</span>
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer
				footerClassName="weather-footer"
				innerClassName="weather-shell weather-footer-inner"
				linksClassName="weather-footer-links"
				brand={t('common.brand')}
				copy={t('common.footerCopy')}
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

export default WeatherForecast





