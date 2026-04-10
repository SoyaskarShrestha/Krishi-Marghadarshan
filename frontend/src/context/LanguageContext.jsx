/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

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

	const setAppLanguage = (nextLanguage) => {
		const normalizedNext = nextLanguage === 'ne' ? 'ne' : 'en'
		setLanguage(normalizedNext)
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('app-language', normalizedNext)
		}
	}

	const toggleLanguage = () => {
		setAppLanguage(language === 'en' ? 'ne' : 'en')
	}

	const value = {
		language,
		isNepali: language === 'ne',
		toggleLanguage,
		setLanguage: setAppLanguage,
	}

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
