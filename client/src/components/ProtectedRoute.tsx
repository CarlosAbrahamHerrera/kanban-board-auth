import { Navigate, Outlet } from 'react-router-dom';
import Auth from '../utils/auth';

const ProtectedRoute = () => {
  // Check if the user is logged in
  if (!Auth.loggedIn()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute; 