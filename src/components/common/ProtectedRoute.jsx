import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/authUtils';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(getUserRole())) {
    return <Navigate to="/home" replace />;
  }

  return children;
}