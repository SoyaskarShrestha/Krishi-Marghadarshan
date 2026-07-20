import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RoleRoute({ children, allowRoles = [] }) {
	const { isAuthReady, isAuthenticated, isProfileComplete, currentUser } = useAuth()
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

	if (currentUser?.isAdmin) {
		return children
	}

	const userRole = currentUser?.accessRole || currentUser?.role
	if (allowRoles.length > 0 && !allowRoles.includes(userRole)) {
		return <Navigate to="/" replace />
	}

	return children
}

export default RoleRoute
