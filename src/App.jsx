import { Navigate, Route, Routes } from 'react-router-dom'
import Articles from './Components/Articles'
import Cart from './Components/Cart'
import Homepage from './Components/Homepage'
import Advisory from './Components/Advisory'
import Shop from './Components/Shop'
import UserProfile from './Components/UserProfile'
import WeatherForecast from './Components/WeatherForecast'
import { LanguageProvider } from './context/LanguageContext'

function App() {
	return (
		<LanguageProvider>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/weather" element={<WeatherForecast />} />
				<Route path="/articles" element={<Articles />} />
				<Route path="/shop" element={<Shop />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/advisory" element={<Advisory />} />
				<Route path="/user-profile" element={<UserProfile />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</LanguageProvider>
	)
}

export default App

