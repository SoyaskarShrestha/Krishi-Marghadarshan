import { createContext, useContext, useState } from 'react'

const AUTH_USERS_KEY = 'krishi_auth_users'
const AUTH_CURRENT_USER_KEY = 'krishi_auth_current_user'

const AuthContext = createContext(null)

function normalizeUser(user) {
	if (!user) {
		return user
	}

	return {
		...user,
		profile: {
			fullName: user.profile?.fullName || user.profile?.realName || '',
			location: user.profile?.location || '',
			cropType: user.profile?.cropType || '',
			phone: user.profile?.phone || '',
		},
	}
}

function readStoredUsers() {
	try {
		const storedUsers = localStorage.getItem(AUTH_USERS_KEY)
		if (!storedUsers) {
			return []
		}

		const parsedUsers = JSON.parse(storedUsers)
		return Array.isArray(parsedUsers) ? parsedUsers.map(normalizeUser) : []
	} catch {
		return []
	}
}

function readStoredCurrentUser() {
	try {
		const storedCurrentUser = localStorage.getItem(AUTH_CURRENT_USER_KEY)
		if (!storedCurrentUser) {
			return null
		}

		return normalizeUser(JSON.parse(storedCurrentUser))
	} catch {
		return null
	}
}

function saveUsers(users) {
	localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))
}

function saveCurrentUser(user) {
	if (!user) {
		localStorage.removeItem(AUTH_CURRENT_USER_KEY)
		return
	}

	localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user))
}

function isProfileComplete(user) {
	if (!user?.profile) {
		return false
	}

	return Boolean(user.profile.location?.trim() && user.profile.cropType?.trim() && user.profile.phone?.trim())
}

export function AuthProvider({ children }) {
	const [users, setUsers] = useState(() => readStoredUsers())
	const [currentUser, setCurrentUser] = useState(() => readStoredCurrentUser())

	const signUp = ({ name, email, password }) => {
		const normalizedEmail = email.trim().toLowerCase()
		if (!normalizedEmail) {
			return { ok: false, message: 'Email is required.' }
		}

		const alreadyExists = users.some((user) => user.email === normalizedEmail)
		if (alreadyExists) {
			return { ok: false, message: 'An account with this email already exists.' }
		}

		const newUser = {
			id: Date.now().toString(),
			name: name.trim() || 'Farmer User',
			email: normalizedEmail,
			password,
			provider: 'password',
			profile: {
				fullName: '',
				location: '',
				cropType: '',
				phone: '',
			},
		}

		const nextUsers = [...users, newUser]
		setUsers(nextUsers)
		saveUsers(nextUsers)

		return {
			ok: true,
			message: 'Signup successful. Please complete your profile details.',
			email: normalizedEmail,
		}
	}

	const signUpWithProvider = ({ provider }) => {
		const normalizedProvider = provider.trim().toLowerCase()
		const providerEmail = `oauth-${normalizedProvider}-${Date.now()}@krishi.app`
		const providerName = `${provider[0].toUpperCase()}${provider.slice(1)} Farmer`

		const newUser = {
			id: Date.now().toString(),
			name: providerName,
			email: providerEmail,
			password: null,
			provider: normalizedProvider,
			profile: {
				fullName: '',
				location: '',
				cropType: '',
				phone: '',
			},
		}

		const nextUsers = [...users, newUser]
		setUsers(nextUsers)
		saveUsers(nextUsers)

		return {
			ok: true,
			message: `${providerName} account created. Please complete your profile details.`,
			email: providerEmail,
		}
	}

	const updateProfile = ({ email, username, fullName, location, cropType, phone }) => {
		const normalizedEmail = email.trim().toLowerCase()
		const matchedUser = users.find((user) => user.email === normalizedEmail)

		if (!matchedUser) {
			return { ok: false, message: 'Account not found. Please sign up first.' }
		}

		const updatedUser = {
			...matchedUser,
			name: username.trim() || matchedUser.name,
			profile: {
				fullName: fullName.trim(),
				location: location.trim(),
				cropType: cropType.trim(),
				phone: phone.trim(),
			},
		}

		const nextUsers = users.map((user) => (user.email === normalizedEmail ? updatedUser : user))
		setUsers(nextUsers)
		saveUsers(nextUsers)

		if (currentUser?.email === normalizedEmail) {
			setCurrentUser(updatedUser)
			saveCurrentUser(updatedUser)
		}

		return { ok: true, message: 'Profile details saved. Please login to continue.' }
	}

	const login = ({ email, password }) => {
		const normalizedEmail = email.trim().toLowerCase()
		const matchedUser = users.find((user) => user.email === normalizedEmail)

		if (!matchedUser || matchedUser.provider !== 'password') {
			return { ok: false, message: 'No password-based account found for this email.' }
		}

		if (matchedUser.password !== password) {
			return { ok: false, message: 'Invalid password.' }
		}

		if (!isProfileComplete(matchedUser)) {
			return {
				ok: false,
				profileIncomplete: true,
				email: matchedUser.email,
				message: 'Please complete your profile details before login.',
			}
		}

		setCurrentUser(matchedUser)
		saveCurrentUser(matchedUser)

		return { ok: true, message: 'Login successful.' }
	}

	const loginWithProvider = ({ provider }) => {
		const normalizedProvider = provider.trim().toLowerCase()
		const matchedUser = users.find((user) => user.provider === normalizedProvider)

		if (!matchedUser) {
			return { ok: false, message: `No ${provider} account found. Please sign up first.` }
		}

		if (!isProfileComplete(matchedUser)) {
			return {
				ok: false,
				profileIncomplete: true,
				email: matchedUser.email,
				message: 'Please complete your profile details before login.',
			}
		}

		setCurrentUser(matchedUser)
		saveCurrentUser(matchedUser)

		return { ok: true, message: 'Login successful.' }
	}

	const logout = () => {
		setCurrentUser(null)
		saveCurrentUser(null)
	}

	const value = {
		users,
		currentUser,
		isAuthenticated: Boolean(currentUser),
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
