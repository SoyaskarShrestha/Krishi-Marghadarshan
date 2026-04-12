/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, hasFirebaseConfig, resolveOAuthProvider } from '../lib/firebaseAuth'
import { API_ENDPOINTS, apiRequest, clearTokens, saveTokens } from '../lib/api'

const AuthContext = createContext(null)

function normalizeUser(user) {
	if (!user) {
		return null
	}

	return {
		id: user.id,
		name: user.username || user.name || user.email,
		email: user.email,
		provider: user.provider || 'password',
		isStaff: Boolean(user.is_staff),
		isSuperuser: Boolean(user.is_superuser),
		isAdmin: Boolean(user.is_superuser),
		profile: {
			fullName: user.profile?.full_name || user.profile?.fullName || '',
			location: user.profile?.location || '',
			cropType: user.profile?.crop_type || user.profile?.cropType || '',
			phone: user.profile?.phone || '',
		},
	}
}

function isProfileComplete(user) {
	if (!user?.profile) {
		return false
	}

	return Boolean(user.profile.location?.trim() && user.profile.cropType?.trim() && user.profile.phone?.trim())
}

function mapOAuthError(error) {
	if (error?.payload?.message) {
		return error.payload.message
	}

	if (!error?.code) {
		return error?.message || 'OAuth login failed. Please try again.'
	}

	switch (error.code) {
		case 'auth/popup-closed-by-user':
			return 'OAuth popup was closed before completing sign in.'
		case 'auth/popup-blocked':
			return 'OAuth popup was blocked by your browser. Please allow popups and try again.'
		case 'auth/account-exists-with-different-credential':
			return 'An account already exists with this email using a different sign-in method.'
		case 'auth/unauthorized-domain':
			return 'This domain is not authorized in Firebase Auth settings.'
		default:
			return 'OAuth login failed. Please check your Firebase setup and try again.'
	}
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [isAuthReady, setIsAuthReady] = useState(false)

	useEffect(() => {
		let ignore = false

		async function loadCurrentUser() {
			try {
				const user = await apiRequest(API_ENDPOINTS.AUTH_ME)
				if (!ignore) {
					setCurrentUser(normalizeUser(user))
				}
			} catch {
				if (!ignore) {
					clearTokens()
					setCurrentUser(null)
				}
			} finally {
				if (!ignore) {
					setIsAuthReady(true)
				}
			}
		}

		loadCurrentUser()

		return () => {
			ignore = true
		}
	}, [])

	const signUp = async ({ name, email, password }) => {
		try {
			const payload = await apiRequest(API_ENDPOINTS.AUTH_REGISTER, {
				method: 'POST',
				body: JSON.stringify({ name, email, password }),
			})

			return {
				ok: true,
				message: payload.message,
				email: payload.email,
			}
		} catch (error) {
			return { ok: false, message: error.message }
		}
	}

	const exchangeOAuthUser = async ({ provider, oauthUser }) => {
		const payload = await apiRequest(API_ENDPOINTS.AUTH_OAUTH, {
			method: 'POST',
			body: JSON.stringify({
				provider,
				email: oauthUser.email,
				name: oauthUser.displayName || '',
			}),
		})

		if (payload.access) {
			saveTokens(payload)
			setCurrentUser(normalizeUser(payload.user))
		}

		return {
			ok: true,
			email: payload.email || oauthUser.email.trim().toLowerCase(),
			profileIncomplete: Boolean(payload.profileIncomplete),
			message: payload.message,
		}
	}

	const signUpWithProvider = async ({ provider }) => {
		if (!hasFirebaseConfig || !auth) {
			return {
				ok: false,
				message: 'OAuth is not configured. Add VITE_FIREBASE_* values to enable Google/GitHub sign in.',
			}
		}

		const providerInstance = resolveOAuthProvider(provider)
		if (!providerInstance) {
			return { ok: false, message: 'Unsupported OAuth provider.' }
		}

		try {
			const { user: oauthUser } = await signInWithPopup(auth, providerInstance)
			if (!oauthUser?.email) {
				return { ok: false, message: 'Provider did not return an email address.' }
			}

			return await exchangeOAuthUser({ provider, oauthUser })
		} catch (error) {
			return { ok: false, message: mapOAuthError(error) }
		}
	}

	const updateProfile = async ({ email, username, fullName, location, cropType, phone }) => {
		try {
			const endpoint = currentUser ? API_ENDPOINTS.AUTH_PROFILE : API_ENDPOINTS.AUTH_COMPLETE_PROFILE
			const method = currentUser ? 'PUT' : 'POST'
			const result = await apiRequest(endpoint, {
				method,
				body: JSON.stringify({
					email,
					username,
					fullName,
					location,
					cropType,
					phone,
				}),
			})

			if (result.user && currentUser) {
				setCurrentUser(normalizeUser(result.user))
			}

			return { ok: true, message: result.message }
		} catch (error) {
			return { ok: false, message: error.message }
		}
	}

	const login = async ({ email, password }) => {
		try {
			const payload = await apiRequest(API_ENDPOINTS.AUTH_LOGIN, {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			})

			saveTokens(payload)
			setCurrentUser(normalizeUser(payload.user))

			return { ok: true, message: payload.message }
		} catch (error) {
			return {
				ok: false,
				profileIncomplete: Boolean(error.payload?.profileIncomplete),
				email: error.payload?.email,
				message: error.message,
			}
		}
	}

	const loginWithProvider = async ({ provider }) => {
		if (!hasFirebaseConfig || !auth) {
			return {
				ok: false,
				message: 'OAuth is not configured. Add VITE_FIREBASE_* values to enable Google/GitHub sign in.',
			}
		}

		const providerInstance = resolveOAuthProvider(provider)
		if (!providerInstance) {
			return { ok: false, message: 'Unsupported OAuth provider.' }
		}

		try {
			const { user: oauthUser } = await signInWithPopup(auth, providerInstance)
			if (!oauthUser?.email) {
				return { ok: false, message: 'Provider did not return an email address.' }
			}

			const result = await exchangeOAuthUser({ provider, oauthUser })
			if (result.profileIncomplete) {
				return {
					ok: false,
					profileIncomplete: true,
					email: result.email,
					message: result.message,
				}
			}

			return { ok: true, message: result.message }
		} catch (error) {
			return { ok: false, message: mapOAuthError(error) }
		}
	}

	const logout = () => {
		clearTokens()
		setCurrentUser(null)
	}

	const value = {
		currentUser,
		isAuthReady,
		isAuthenticated: Boolean(currentUser),
		isAdmin: Boolean(currentUser?.isAdmin),
		isProfileComplete,
		signUp,
		signUpWithProvider,
		updateProfile,
		login,
		loginWithProvider,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used inside an AuthProvider')
	}

	return context
}
