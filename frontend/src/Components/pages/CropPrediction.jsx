import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../layout/Footer'
import NavBar from '../layout/NavBar'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'
import botIcon from '../../assets/navbar/chatbot.svg'
import './CropPrediction.css'

const numericFields = [
	{ key: 'Altitude_m', labelKey: 'cropPrediction.fields.altitude', unit: 'm' },
	{ key: 'Avg_Temperature_C', labelKey: 'cropPrediction.fields.temperature', unit: 'C' },
	{ key: 'Annual_Rainfall_mm', labelKey: 'cropPrediction.fields.rainfall', unit: 'mm' },
	{ key: 'Humidity_pct', labelKey: 'cropPrediction.fields.humidity', unit: '%' },
	{ key: 'Soil_pH', labelKey: 'cropPrediction.fields.ph', unit: '' },
	{ key: 'Nitrogen_kg_ha', labelKey: 'cropPrediction.fields.nitrogen', unit: 'kg/ha' },
	{ key: 'Phosphorus_kg_ha', labelKey: 'cropPrediction.fields.phosphorus', unit: 'kg/ha' },
	{ key: 'Potassium_kg_ha', labelKey: 'cropPrediction.fields.potassium', unit: 'kg/ha' },
]

function CropPrediction() {
	const { t } = useTranslation()
	const messagesEndRef = useRef(null)
	const [options, setOptions] = useState({
		districts: [],
		seasons: [],
		soil_types: [],
		numeric_ranges: {},
	})
	const [isLoadingOptions, setIsLoadingOptions] = useState(true)
	const [isSending, setIsSending] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'assistant',
			kind: 'intro',
			text: t('cropPrediction.intro', {
				defaultValue: 'Share your location and soil readings to get the top 3 crop matches.',
			}),
		},
	])
	const [formData, setFormData] = useState({
		District: '',
		Season: '',
		Soil_Type: '',
		Altitude_m: '',
		Avg_Temperature_C: '',
		Annual_Rainfall_mm: '',
		Humidity_pct: '',
		Soil_pH: '',
		Nitrogen_kg_ha: '',
		Phosphorus_kg_ha: '',
		Potassium_kg_ha: '',
	})

	const labels = useMemo(() => ({
		title: t('cropPrediction.title', { defaultValue: 'Crop Prediction' }),
		subtitle: t('cropPrediction.subtitle', { defaultValue: 'ML-powered crop recommendations for Nepali districts.' }),
		headline: t('cropPrediction.headline', { defaultValue: 'Get a ranked crop recommendation.' }),
		send: t('cropPrediction.send', { defaultValue: 'Predict' }),
		sending: t('cropPrediction.sending', { defaultValue: 'Predicting...' }),
		emptyState: t('cropPrediction.emptyState', { defaultValue: 'Predictions will appear here after you submit the form.' }),
		errorFallback: t('cropPrediction.error', { defaultValue: 'Unable to predict right now. Please try again.' }),
		locationLabel: t('cropPrediction.locationLabel', { defaultValue: 'Location & Season' }),
		soilLabel: t('cropPrediction.soilLabel', { defaultValue: 'Soil & Climate Inputs' }),
		resultsLabel: t('cropPrediction.resultsLabel', { defaultValue: 'Prediction Results' }),
	}), [t])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, isSending])

	useEffect(() => {
		let ignore = false

		async function loadOptions() {
			setIsLoadingOptions(true)
			try {
				const payload = await apiRequest(API_ENDPOINTS.CROP_PREDICT_OPTIONS)
				if (ignore) {
					return
				}
				setOptions({
					districts: payload?.districts || [],
					seasons: payload?.seasons || [],
					soil_types: payload?.soil_types || [],
					numeric_ranges: payload?.numeric_ranges || {},
				})
				setFormData((previous) => ({
					...previous,
					District: previous.District || payload?.districts?.[0] || '',
					Season: previous.Season || payload?.seasons?.[0] || '',
					Soil_Type: previous.Soil_Type || payload?.soil_types?.[0] || '',
				}))
				setErrorMessage('')
			} catch (error) {
				if (!ignore) {
					setErrorMessage(error.message || labels.errorFallback)
				}
			} finally {
				if (!ignore) {
					setIsLoadingOptions(false)
				}
			}
		}

		loadOptions()

		return () => {
			ignore = true
		}
	}, [labels.errorFallback])

	const handleInputChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const buildUserSummary = (payload) => (
		`${payload.District} • ${payload.Season} • ${payload.Soil_Type}`
	)

	const buildPredictionMessage = (payload) => ({
		id: Date.now() + Math.random(),
		role: 'assistant',
		kind: 'prediction',
		text: payload?.note || '',
		location: payload?.location,
		season: payload?.season,
		soil_type: payload?.soil_type,
		prediction: payload?.prediction || payload?.predictions?.[0] || null,
	})

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (isSending || isLoadingOptions) {
			return
		}

		const numericPayload = {}
		let hasInvalid = false
		numericFields.forEach((field) => {
			const value = parseFloat(formData[field.key])
			if (Number.isNaN(value)) {
				hasInvalid = true
			}
			numericPayload[field.key] = value
		})

		if (hasInvalid) {
			setErrorMessage(t('cropPrediction.validation', { defaultValue: 'Please fill in all numeric values.' }))
			return
		}

		const payload = {
			District: formData.District,
			Season: formData.Season,
			Soil_Type: formData.Soil_Type,
			...numericPayload,
		}

		setMessages((previous) => ([
			...previous,
			{ id: Date.now(), role: 'user', kind: 'summary', text: buildUserSummary(payload) },
		]))
		setIsSending(true)
		setErrorMessage('')

		try {
			const response = await apiRequest(API_ENDPOINTS.CROP_PREDICT, {
				method: 'POST',
				body: JSON.stringify(payload),
			})
			setMessages((previous) => ([
				...previous,
				buildPredictionMessage(response),
			]))
		} catch (error) {
			setErrorMessage(error.message || labels.errorFallback)
		} finally {
			setIsSending(false)
		}
	}

	return (
		<div className="crop-predict-page">
			<NavBar />
			<main className="crop-predict-shell">
				<section className="crop-predict-head">
					<div className="crop-predict-head-brand">
						<img src={botIcon} alt="Prediction icon" className="crop-predict-hero-icon" />
						<div>
							<h2>{labels.title}</h2>
							<p>{labels.subtitle}</p>
						</div>
					</div>
					<h3>{labels.headline}</h3>
				</section>

				<section className="crop-predict-card">
					<form className="crop-predict-form" onSubmit={handleSubmit}>
						<div className="crop-predict-form-block">
							<h4>{labels.locationLabel}</h4>
							<div className="crop-predict-field">
								<label htmlFor="District">{t('cropPrediction.fields.district', { defaultValue: 'District' })}</label>
								<select
									id="District"
									name="District"
									value={formData.District}
									onChange={handleInputChange}
									disabled={isLoadingOptions}
									required
								>
									{options.districts.map((item) => (
										<option key={item} value={item}>{item}</option>
									))}
								</select>
							</div>
							<div className="crop-predict-field">
								<label htmlFor="Season">{t('cropPrediction.fields.season', { defaultValue: 'Season' })}</label>
								<select
									id="Season"
									name="Season"
									value={formData.Season}
									onChange={handleInputChange}
									disabled={isLoadingOptions}
									required
								>
									{options.seasons.map((item) => (
										<option key={item} value={item}>{item}</option>
									))}
								</select>
							</div>
							<div className="crop-predict-field">
								<label htmlFor="Soil_Type">{t('cropPrediction.fields.soilType', { defaultValue: 'Soil Type' })}</label>
								<select
									id="Soil_Type"
									name="Soil_Type"
									value={formData.Soil_Type}
									onChange={handleInputChange}
									disabled={isLoadingOptions}
									required
								>
									{options.soil_types.map((item) => (
										<option key={item} value={item}>{item}</option>
									))}
								</select>
							</div>
						</div>

						<div className="crop-predict-form-block">
							<h4>{labels.soilLabel}</h4>
							<div className="crop-predict-grid">
								{numericFields.map((field) => {
									const range = options.numeric_ranges?.[field.key] || []
									const min = range[0]
									const max = range[1]
									const hint = (Number.isFinite(min) && Number.isFinite(max))
										? `${min} - ${max}${field.unit ? ` ${field.unit}` : ''}`
										: ''

									return (
										<div className="crop-predict-field" key={field.key}>
											<label htmlFor={field.key}>{t(field.labelKey)}</label>
											<input
												id={field.key}
												name={field.key}
												type="number"
												step="any"
												min={Number.isFinite(min) ? min : undefined}
												max={Number.isFinite(max) ? max : undefined}
												value={formData[field.key]}
												onChange={handleInputChange}
												required
												placeholder={hint}
											/>
											{hint ? <span className="crop-predict-hint">{hint}</span> : null}
										</div>
									)
								})}
							</div>
						</div>

						<button type="submit" className="crop-predict-submit" disabled={isSending || isLoadingOptions}>
							{isSending ? labels.sending : labels.send}
						</button>
					</form>

					<div className="crop-predict-results" aria-live="polite">
						<h4>{labels.resultsLabel}</h4>
						<div className="crop-predict-messages">
							{messages.length === 0 ? <p className="crop-predict-empty">{labels.emptyState}</p> : null}
							{messages.map((item) => (
								<article
									key={item.id}
									className={`crop-predict-message-row ${item.role === 'user' ? 'crop-predict-message-row-user' : 'crop-predict-message-row-assistant'}`}
								>
									{item.role === 'assistant' ? <img src={botIcon} alt="AI" className="crop-predict-avatar" /> : null}
									<div className={`crop-predict-message ${item.role === 'user' ? 'crop-predict-message-user' : 'crop-predict-message-assistant'}`}>
										{item.kind === 'prediction' ? (
											<div className="crop-predict-result-card">
												<p className="crop-predict-result-meta">
													<strong>{item.location?.district || formData.District}</strong>
													<span>{item.location?.province || ''}</span>
													<span>{item.location?.zone || ''}</span>
												</p>
												{item.prediction ? (
													<ul>
														<li>
															<span className="crop-predict-rank">#1</span>
															<strong>{item.prediction.crop}</strong>
															<span>{item.prediction.confidence_pct}%</span>
														</li>
													</ul>
												) : null}
											</div>
										) : (
											<p>{item.text}</p>
										)}
									</div>
								</article>
							))}
							{isSending ? (
								<article className="crop-predict-message-row crop-predict-message-row-assistant">
									<img src={botIcon} alt="AI" className="crop-predict-avatar" />
									<div className="crop-predict-message crop-predict-message-assistant crop-predict-typing">{labels.sending}</div>
								</article>
							) : null}
							<div ref={messagesEndRef} />
						</div>
						{errorMessage ? <p className="crop-predict-error">{errorMessage}</p> : null}
					</div>
				</section>
			</main>
			<Footer
				footerClassName="crop-predict-footer"
				innerClassName="crop-predict-footer-inner"
				linksClassName="crop-predict-footer-links"
				brand={t('common.brand', { defaultValue: 'Krishi Margadarshan' })}
				copy={t('common.footerCopy', { defaultValue: 'Agriculture guidance for every farmer.' })}
				wrapBrandCopy
				links={[
					{ to: '/advisory', label: t('common.supportCenters', { defaultValue: 'Support Centers' }) },
					{ to: '/articles', label: t('common.faq', { defaultValue: 'FAQ' }) },
					{ to: '/advisory', label: t('common.contact', { defaultValue: 'Contact' }) },
				]}
			/>
		</div>
	)
}

export default CropPrediction
