const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const ACCESS_TOKEN_KEY = 'krishi_access_token'
const REFRESH_TOKEN_KEY = 'krishi_refresh_token'

export function getAccessToken() {
	return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function saveTokens({ access, refresh }) {
	if (access) {
		localStorage.setItem(ACCESS_TOKEN_KEY, access)
	}

	if (refresh) {
		localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
	}
}

export function clearTokens() {
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function apiRequest(path, options = {}) {
	const token = getAccessToken()
	const headers = new Headers(options.headers || {})

	if (!headers.has('Content-Type') && options.body) {
		headers.set('Content-Type', 'application/json')
	}

	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
	})

	const contentType = response.headers.get('content-type') || ''
	const payload = contentType.includes('application/json')
		? await response.json()
		: null

	if (!response.ok) {
		const message =
			payload?.message ||
			payload?.detail ||
			payload?.email?.[0] ||
			payload?.non_field_errors?.[0] ||
			'Request failed.'
		const error = new Error(message)
		error.payload = payload
		error.status = response.status
		throw error
	}

	return payload
}
