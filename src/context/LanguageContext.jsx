import { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

function getInitialLanguage() {
	if (typeof window === 'undefined') {
		return 'en'
	}

	const saved = window.localStorage.getItem('app-language')
	return saved === 'ne' ? 'ne' : 'en'
}

export function LanguageProvider({ children }) {
	const [language, setLanguage] = useState(getInitialLanguage)

	const toggleLanguage = () => {
		setLanguage((prev) => {
			const next = prev === 'en' ? 'ne' : 'en'
			if (typeof window !== 'undefined') {
				window.localStorage.setItem('app-language', next)
			}
			return next
		})
	}

	const value = useMemo(
		() => ({ language, isNepali: language === 'ne', toggleLanguage }),
		[language]
	)

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
