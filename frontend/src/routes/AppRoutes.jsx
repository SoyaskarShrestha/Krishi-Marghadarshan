import { Navigate, Route, Routes } from 'react-router-dom'
import {
	AdminDashboard,
<<<<<<< HEAD
	AdminRoute,
=======
	AdvisorPanel,
>>>>>>> e6fc3f927624e825f6e8d916d676a90c206200ea
	Articles,
	Cart,
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
<<<<<<< HEAD
=======
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
>>>>>>> e6fc3f927624e825f6e8d916d676a90c206200ea
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
<<<<<<< HEAD
=======
				path="/advisor-panel"
				element={(
					<RoleRoute allowRoles={["advisor"]}>
						<AdvisorPanel />
					</RoleRoute>
				)}
			/>
			<Route
>>>>>>> e6fc3f927624e825f6e8d916d676a90c206200ea
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