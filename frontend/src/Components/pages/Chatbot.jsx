import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../layout/Footer'
import NavBar from '../layout/NavBar'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'
import botIcon from '../../assets/navbar/chatbot.svg'
import './Chatbot.css'

function Chatbot() {
	const { t } = useTranslation()
	const [inputValue, setInputValue] = useState('')
	const [isSending, setIsSending] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const messagesEndRef = useRef(null)
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'assistant',
			text: 'Namaste. I am your Krishi AI assistant. Ask me anything about crops, irrigation, pests, soil, weather, or livestock.',
		},
	])

	const labels = useMemo(() => ({
		title: t('chatbot.title', { defaultValue: 'Krishi AI Chatbot' }),
		subtitle: t('chatbot.subtitle', { defaultValue: 'Gemini-powered assistant for faster farming decisions.' }),
		headline: t('chatbot.headline', { defaultValue: 'How can I help your farm today?' }),
		placeholder: t('chatbot.placeholder', { defaultValue: 'Type your farming question here...' }),
		hint: t('chatbot.hint', { defaultValue: 'Press Enter to send, Shift+Enter for a new line.' }),
		emptyState: t('chatbot.emptyState', { defaultValue: 'Start with one of the suggestions above or type your question below.' }),
		send: t('chatbot.send', { defaultValue: 'Send' }),
		sending: t('chatbot.sending', { defaultValue: 'Sending...' }),
		errorFallback: t('chatbot.error', { defaultValue: 'Unable to get reply right now. Please try again.' }),
	}), [t])

	const starterPrompts = useMemo(() => ([
		t('chatbot.starter1', { defaultValue: 'My tomato leaves are curling. What should I check first?' }),
		t('chatbot.starter2', { defaultValue: 'Best irrigation schedule for rice this week?' }),
		t('chatbot.starter3', { defaultValue: 'Organic way to control aphids in mustard crop?' }),
		t('chatbot.starter4', { defaultValue: 'How to improve sandy soil before planting?' }),
	]), [t])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, isSending])

	const sendMessage = async (rawMessage) => {
		const message = rawMessage.trim()
		if (!message || isSending) {
			return
		}

		const userMessage = {
			id: Date.now(),
			role: 'user',
			text: message,
		}

		const nextMessages = [...messages, userMessage]
		setMessages(nextMessages)
		setInputValue('')
		setErrorMessage('')
		setIsSending(true)

		try {
			const history = nextMessages.map((item) => ({
				role: item.role,
				text: item.text,
			}))
			const payload = await apiRequest(API_ENDPOINTS.CHATBOT_MESSAGE, {
				method: 'POST',
				body: JSON.stringify({
					message,
					history,
				}),
			})

			setMessages((previous) => [
				...previous,
				{
					id: Date.now() + 1,
					role: 'assistant',
					text: payload?.reply || labels.errorFallback,
				},
			])
		} catch (error) {
			setErrorMessage(error.message || labels.errorFallback)
		} finally {
			setIsSending(false)
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		await sendMessage(inputValue)
	}

	const handlePromptClick = async (prompt) => {
		setInputValue(prompt)
		await sendMessage(prompt)
	}

	const handleInputKeyDown = async (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			await sendMessage(inputValue)
		}
	}

	return (
		<div className="chatbot-page">
			<NavBar />
			<main className="chatbot-shell">
				<section className="chatbot-head">
					<div className="chatbot-head-brand">
						<img src={botIcon} alt="Chatbot icon" className="chatbot-hero-icon" />
						<div>
							<h2>{labels.title}</h2>
							<p>{labels.subtitle}</p>
						</div>
					</div>
					<h3>{labels.headline}</h3>
					<div className="chatbot-starter-grid">
						{starterPrompts.map((prompt) => (
							<button
								type="button"
								key={prompt}
								className="chatbot-starter-chip"
								onClick={() => handlePromptClick(prompt)}
								disabled={isSending}
							>
								{prompt}
							</button>
						))}
					</div>
				</section>

				<section className="chatbot-card" aria-label="Conversation with Krishi AI">
					<div className="chatbot-messages" aria-live="polite">
						{messages.length === 0 ? <p className="chatbot-empty-state">{labels.emptyState}</p> : null}
						{messages.map((item) => (
							<article
								key={item.id}
								className={`chatbot-message-row ${item.role === 'user' ? 'chatbot-message-row-user' : 'chatbot-message-row-assistant'}`}
							>
								{item.role === 'assistant' ? <img src={botIcon} alt="AI" className="chatbot-avatar" /> : null}
								<div className={`chatbot-message ${item.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant'}`}>
									<p>{item.text}</p>
								</div>
							</article>
						))}
						{isSending ? (
							<article className="chatbot-message-row chatbot-message-row-assistant">
								<img src={botIcon} alt="AI" className="chatbot-avatar" />
								<div className="chatbot-message chatbot-message-assistant chatbot-typing">{labels.sending}</div>
							</article>
						) : null}
						<div ref={messagesEndRef} />
					</div>

					{errorMessage ? <p className="chatbot-error">{errorMessage}</p> : null}

					<form className="chatbot-input-dock" onSubmit={handleSubmit}>
						<textarea
							value={inputValue}
							onChange={(event) => setInputValue(event.target.value)}
							onKeyDown={handleInputKeyDown}
							placeholder={labels.placeholder}
							disabled={isSending}
							rows={2}
							required
						/>
						<button type="submit" disabled={isSending}>
							{isSending ? labels.sending : labels.send}
						</button>
					</form>
					<p className="chatbot-input-hint">{labels.hint}</p>
				</section>
			</main>
			<Footer
				footerClassName="chatbot-footer"
				innerClassName="chatbot-footer-inner"
				linksClassName="chatbot-footer-links"
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

export default Chatbot
