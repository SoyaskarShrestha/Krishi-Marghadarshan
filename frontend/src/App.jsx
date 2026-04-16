import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {
	return (
		<AuthProvider>
			<LanguageProvider>
				<AppRoutes />
			</LanguageProvider>
		</AuthProvider>
	)
}

export default App

