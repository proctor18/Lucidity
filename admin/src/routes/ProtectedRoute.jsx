import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // You'll want to replace this with actual authentication logic
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
