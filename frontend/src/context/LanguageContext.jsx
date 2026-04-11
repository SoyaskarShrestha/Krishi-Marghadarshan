/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import i18n, { getInitialLanguage, LANGUAGE_STORAGE_KEY } from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
	const [language, setLanguage] = useState(getInitialLanguage)

	const setAppLanguage = (nextLanguage) => {
		const normalizedNext = nextLanguage === 'ne' ? 'ne' : 'en'
		setLanguage(normalizedNext)
		i18n.changeLanguage(normalizedNext)
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedNext)
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
