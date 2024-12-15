import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteType {
    children : ReactNode;
}

const ProtectedRoute = ({ children } : ProtectedRouteType) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must log in to access this page!");
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
