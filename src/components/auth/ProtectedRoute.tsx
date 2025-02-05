import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

const ProtectedRoute = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return null;
	}

	return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;