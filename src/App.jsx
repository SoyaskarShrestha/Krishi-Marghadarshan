import { Navigate, Route, Routes } from 'react-router-dom'
import Articles from './Articles'
import Cart from './Cart'
import Homepage from './Homepage'
import Profile from './Profile'
import Shop from './Shop'
import UserProfile from './UserProfile'
import WeatherForecast from './WeatherForecast'

function App() {
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/weather" element={<WeatherForecast />} />
			<Route path="/articles" element={<Articles />} />
			<Route path="/shop" element={<Shop />} />
			<Route path="/cart" element={<Cart />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/user-profile" element={<UserProfile />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
