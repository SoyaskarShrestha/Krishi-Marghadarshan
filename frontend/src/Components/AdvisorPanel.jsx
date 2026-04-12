import { useCallback, useEffect, useMemo, useState } from 'react'
import NavBar from './NavBar'
import './AdvisorPanel.css'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const statusFilters = [
	{ label: 'All', value: 'all' },
	{ label: 'Pending', value: 'pending' },
	{ label: 'Answered', value: 'answered' },
]

function AdvisorPanel() {
	const { currentUser } = useAuth()
	const [questions, setQuestions] = useState([])
	const [replyDrafts, setReplyDrafts] = useState({})
	const [statusFilter, setStatusFilter] = useState('pending')
	const [isLoading, setIsLoading] = useState(false)
	const [feedback, setFeedback] = useState('')
	const [error, setError] = useState('')

	const loadQuestions = useCallback(async () => {
		setIsLoading(true)
		setError('')
		try {
			const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`
			const payload = await apiRequest(`${API_ENDPOINTS.ADVISORY_QUESTIONS}${query}`)
			setQuestions(Array.isArray(payload) ? payload : [])
		} catch (requestError) {
			setError(requestError.message || 'Unable to load advisory questions.')
		} finally {
			setIsLoading(false)
		}
	}, [statusFilter])

	useEffect(() => {
		loadQuestions()
	}, [loadQuestions])

	const summary = useMemo(() => {
		const pending = questions.filter((item) => item.status === 'pending').length
		const answered = questions.filter((item) => item.status === 'answered').length
		return { pending, answered }
	}, [questions])

	const onDraftChange = (questionId, value) => {
		setReplyDrafts((current) => ({ ...current, [questionId]: value }))
	}

	const sendReply = async (questionId) => {
		const draft = (replyDrafts[questionId] || '').trim()
		if (!draft) {
			setError('Reply cannot be empty.')
			return
		}

		setFeedback('')
		setError('')
		try {
			const payload = await apiRequest(`${API_ENDPOINTS.ADVISORY_QUESTIONS}${questionId}/`, {
				method: 'PATCH',
				body: JSON.stringify({ advisor_reply: draft }),
			})
			const updatedQuestion = payload.question
			setQuestions((current) => current.map((item) => (item.id === questionId ? updatedQuestion : item)))
			setReplyDrafts((current) => ({ ...current, [questionId]: '' }))
			setFeedback(payload.message || 'Reply sent successfully.')
		} catch (requestError) {
			setError(requestError.message || 'Unable to send reply.')
		}
	}

	return (
		<div className="advisor-page">
			<NavBar />
			<main className="advisor-shell advisor-main">
				<section className="advisor-header">
					<div>
						<h2>Advisor Panel</h2>
						<p>
							{currentUser?.isSuperuser ? 'Superuser oversight enabled.' : 'Respond to farmer questions from this panel.'}
						</p>
					</div>
					<div className="advisor-summary">
						<div>
							<small>Pending</small>
							<strong>{summary.pending}</strong>
						</div>
						<div>
							<small>Answered</small>
							<strong>{summary.answered}</strong>
						</div>
					</div>
				</section>

				<section className="advisor-toolbar">
					<div className="advisor-filter-group">
						{statusFilters.map((filter) => (
							<button
								key={filter.value}
								type="button"
								onClick={() => setStatusFilter(filter.value)}
								className={statusFilter === filter.value ? 'active' : ''}
							>
								{filter.label}
							</button>
						))}
					</div>
					<button type="button" className="advisor-refresh" onClick={loadQuestions}>
						Refresh
					</button>
				</section>

				{feedback ? <p className="advisor-feedback">{feedback}</p> : null}
				{error ? <p className="advisor-error">{error}</p> : null}
				{isLoading ? <p>Loading questions...</p> : null}

				<section className="advisor-list">
					{questions.length === 0 && !isLoading ? <p className="advisor-empty">No questions found for this filter.</p> : null}
					{questions.map((question) => (
						<article className="advisor-card" key={question.id}>
							<header>
								<div>
									<strong>{question.full_name}</strong>
									<p>
										{question.category} • {new Date(question.created_at).toLocaleString()}
									</p>
									{question.submitted_by ? <p>Account: {question.submitted_by}</p> : null}
								</div>
								<span className={`advisor-status ${question.status}`}>{question.status}</span>
							</header>
							<p className="advisor-question">{question.question}</p>

							{question.advisor_reply ? (
								<div className="advisor-reply-history">
									<strong>Latest reply</strong>
									<p>{question.advisor_reply}</p>
									<small>
										{question.advisor_name || 'Advisor'}
										{question.replied_at ? ` • ${new Date(question.replied_at).toLocaleString()}` : ''}
									</small>
								</div>
							) : null}

							<div className="advisor-reply-box">
								<textarea
									rows="4"
									value={replyDrafts[question.id] || ''}
									onChange={(event) => onDraftChange(question.id, event.target.value)}
									placeholder="Write a response to this question..."
								/>
								<button type="button" onClick={() => sendReply(question.id)}>
									Send Reply
								</button>
							</div>
						</article>
					))}
				</section>
			</main>
		</div>
	)
}

export default AdvisorPanel
