import { Navigate, Route, Routes } from 'react-router-dom'
import {
	Advisory,
	AdminDashboard,
	AdminRoute,
	AdvisorPanel,
	AdvisorRoute,
	Articles,
	Cart,
	Chatbot,
	CompleteProfile,
	Homepage,
	Login,
	ProtectedRoute,
	Shop,
	SignUp,
	UserProfile,
	WeatherForecast,
} from '../Components'

function AppRoutes() {
	return (
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
			<Route path="/chatbot" element={<Chatbot />} />
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
	)
}

export default AppRoutes