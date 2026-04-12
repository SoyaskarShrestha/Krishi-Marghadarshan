const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const ACCESS_TOKEN_KEY = 'krishi_access_token'
const REFRESH_TOKEN_KEY = 'krishi_refresh_token'

export const API_ENDPOINTS = {
	AUTH_REGISTER: import.meta.env.VITE_API_AUTH_REGISTER || '/auth/register/',
	AUTH_COMPLETE_PROFILE: import.meta.env.VITE_API_AUTH_COMPLETE_PROFILE || '/auth/complete-profile/',
	AUTH_LOGIN: import.meta.env.VITE_API_AUTH_LOGIN || '/auth/login/',
	AUTH_OAUTH: import.meta.env.VITE_API_AUTH_OAUTH || '/auth/oauth/',
	AUTH_ME: import.meta.env.VITE_API_AUTH_ME || '/auth/me/',
	AUTH_CONSULTATION_SUMMARY: import.meta.env.VITE_API_AUTH_CONSULTATION_SUMMARY || '/auth/consultation-summary/',
	AUTH_PROFILE: import.meta.env.VITE_API_AUTH_PROFILE || '/auth/profile/',
	AUTH_PROFILE_PHOTO: import.meta.env.VITE_API_AUTH_PROFILE_PHOTO || '/auth/profile/photo/',
	AUTH_ADMIN_ACTIVITY: import.meta.env.VITE_API_AUTH_ADMIN_ACTIVITY || '/auth/admin-activity/',
	ARTICLES: import.meta.env.VITE_API_ARTICLES || '/articles/',
	ARTICLES_SAVED: import.meta.env.VITE_API_ARTICLES_SAVED || '/articles/saved/',
	SHOP_PRODUCTS: import.meta.env.VITE_API_SHOP_PRODUCTS || '/shop/products/',
	SHOP_CART: import.meta.env.VITE_API_SHOP_CART || '/shop/cart/',
	ADVISORY_META: import.meta.env.VITE_API_ADVISORY_META || '/advisory/meta/',
	ADVISORY_QUESTIONS: import.meta.env.VITE_API_ADVISORY_QUESTIONS || '/advisory/questions/',
	WEATHER_FORECAST: import.meta.env.VITE_API_WEATHER_FORECAST || '/weather/forecast/',
}

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

	if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
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
