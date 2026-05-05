import { Navigate, Route, Routes } from 'react-router-dom'
import {
	Advisory,
	AdminDashboard,
	AdvisorPanel,
	Articles,
	Cart,
	Chatbot,
	CropPrediction,
	CompleteProfile,
	Homepage,
	Login,
	ProtectedRoute,
	RoleRoute,
	Shop,
	SignUp,
	UserProfile,
	WeatherForecast,
} from '../Components'

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route
				path="/weather"
				element={(
					<RoleRoute allowRoles={["farmer"]}>
						<WeatherForecast />
					</RoleRoute>
				)}
			/>
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
			<Route
				path="/advisory"
				element={(
					<RoleRoute allowRoles={["farmer", "advisor"]}>
						<Advisory />
					</RoleRoute>
				)}
			/>
			<Route path="/chatbot" element={<Chatbot />} />
			<Route
				path="/crop-prediction"
				element={(
					<RoleRoute allowRoles={["farmer"]}>
						<CropPrediction />
					</RoleRoute>
				)}
			/>
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
					<RoleRoute allowRoles={["advisor"]}>
						<AdvisorPanel />
					</RoleRoute>
				)}
			/>
			<Route
				path="/admin-dashboard"
				element={(
					<RoleRoute allowRoles={["admin"]}>
						<AdminDashboard />
					</RoleRoute>
				)}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default AppRoutes