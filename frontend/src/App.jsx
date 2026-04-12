import { Navigate, Route, Routes } from 'react-router-dom'
import Articles from './Components/Articles'
import Cart from './Components/Cart'
import Homepage from './Components/Homepage'
import Advisory from './Components/Advisory'
import Shop from './Components/Shop'
import UserProfile from './Components/UserProfile'
import WeatherForecast from './Components/WeatherForecast'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import ProtectedRoute from './Components/ProtectedRoute'
import CompleteProfile from './Components/CompleteProfile'
import AdminDashboard from './Components/AdminDashboard'
import AdminRoute from './Components/AdminRoute'
import AdvisorPanel from './Components/AdvisorPanel'
import AdvisorRoute from './Components/AdvisorRoute'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'

function App() {
	return (
		<AuthProvider>
			<LanguageProvider>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/weather" element={<WeatherForecast />} />
					<Route path="/articles" element={<Articles />} />
					<Route path="/shop" element={<Shop />} />
					<Route
						path="/cart"
						element={(
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						)}
					/>
					<Route path="/advisory" element={<Advisory />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/complete-profile" element={<CompleteProfile />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/user-profile"
						element={(
							<ProtectedRoute>
								<UserProfile />
							</ProtectedRoute>
						)}
					/>
					<Route
						path="/advisor-panel"
						element={(
							<AdvisorRoute>
								<AdvisorPanel />
							</AdvisorRoute>
						)}
					/>
					<Route
						path="/admin-dashboard"
						element={(
							<AdminRoute>
								<AdminDashboard />
							</AdminRoute>
						)}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</LanguageProvider>
		</AuthProvider>
	)
}

export default App

