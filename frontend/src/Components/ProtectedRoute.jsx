import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
	const { isAuthReady, isAuthenticated, currentUser, isProfileComplete } = useAuth()
	const location = useLocation()

	if (!isAuthReady) {
		return null
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />
	}

	if (!isProfileComplete(currentUser)) {
		return <Navigate to="/complete-profile" replace state={{ email: currentUser?.email }} />
	}

	return children
}

export default ProtectedRoute
